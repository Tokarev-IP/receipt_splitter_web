import {    
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    User,
    signInWithCredential,
    AuthCredential,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { deleteUserAttempts } from "./FirestoreUseCase";

export async function signInUsingEmailAndPassword(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        throw error;
    }
}

export async function diagnoseAppCheck() {
    try {
        console.log('=== App Check Diagnosis ===');
        
        // Проверяем доступность reCAPTCHA
        const recaptchaScript = document.querySelector('script[src*="recaptcha"]');
        console.log('reCAPTCHA script loaded:', !!recaptchaScript);
        
        // Проверяем домен
        console.log('Current domain:', window.location.hostname);
        console.log('Current protocol:', window.location.protocol);
        
        // Проверяем App Check
        const { appCheck } = await import('./FirebaseConfig');
        if (appCheck) {
            console.log('App Check instance exists');
            try {
                const { getToken } = await import('firebase/app-check');
                const token = await getToken(appCheck);
                console.log('App Check token obtained successfully');
                return true;
            } catch (tokenError) {
                console.error('App Check token error:', tokenError);
                return false;
            }
        } else {
            console.error('App Check instance not found');
            return false;
        }
    } catch (error) {
        console.error('Diagnosis error:', error);
        return false;
    }
}

export async function registerUsingEmailAndPassword(email: string, password: string) {
    try {
        console.log('Starting registration process...');
        console.log('Email:', email);
        console.log('Auth instance:', auth);
        
        // Check if App Check is properly initialized
        const { appCheck } = await import('./FirebaseConfig');
        if (!appCheck) {
            console.warn('App Check not initialized, proceeding without it');
        } else {
            try {
                const { getToken } = await import('firebase/app-check');
                const token = await getToken(appCheck);
                console.log('App Check token obtained successfully');
            } catch (tokenError) {
                console.warn('App Check token error, proceeding without it:', tokenError);
            }
        }
        
        // Check if we're on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('Is mobile device:', isMobile);
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Registration successful:', userCredential);
        return userCredential;
    } catch (error: any) {
        console.error('Registration error details:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        
        // Handle specific App Check errors
        if (error.code === 'auth/firebase-app-check-token-is-invalid') {
            console.error('App Check token is invalid. This might be due to:');
            console.error('1. reCAPTCHA site key mismatch');
            console.error('2. Domain not configured in Firebase Console');
            console.error('3. App Check not properly initialized');
            
            // Try to reinitialize App Check
            try {
                const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
                const { firebaseApp } = await import('./FirebaseConfig');
                
                const newAppCheck = initializeAppCheck(firebaseApp, {
                    provider: new ReCaptchaV3Provider('6Le2WHQrAAAAAE0AmTHSfqLnRaROoxET5A71-JSw'),
                    isTokenAutoRefreshEnabled: true
                });
                
                console.log('App Check reinitialized, retrying registration...');
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                return userCredential;
            } catch (retryError) {
                console.error('Retry failed:', retryError);
                throw new Error('Registration failed due to App Check configuration issues. Please check your Firebase Console settings.');
            }
        }
        
        // Специальная обработка для network-request-failed
        if (error.code === 'auth/network-request-failed') {
            console.error('Network request failed - this might be related to App Check or network issues');
            console.error('Please check:');
            console.error('1. Internet connection');
            console.error('2. App Check configuration');
            console.error('3. reCAPTCHA site key validity');
            console.error('4. Domain configuration in Firebase Console');
        }
        
        throw error;
    }
}

export async function sendPasswordResetLinkToEmail(email: string) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        throw error;
    }
}

export async function sendEmailVerificationLink(user: User) {
    try {
        await sendEmailVerification(user);
    } catch (error) {
        throw error;
    }
}

export async function getCurrentUser() {
    return auth.currentUser;
}

export async function signInUsingCredential(credential: AuthCredential) {
    try {
        const userCredential = await signInWithCredential(auth, credential);
        return userCredential;
    } catch (error) {
        throw error;
    }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  try {
    if (isMobile) {
      // Use redirect for mobile devices
      await signInWithRedirect(auth, provider);
      // Note: The redirect will happen, and the user will be redirected back
      // The result will be handled in the component that calls this function
    } else {
      // Use popup for desktop devices
      const result = await signInWithPopup(auth, provider);
      return result;
    }
  } catch (error) {
    throw error;
  }
}

export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteAccount(email?: string, password?: string) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user is currently signed in');
        }
        await deleteUserAttempts(user.uid);
        await deleteUser(user);
    } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
            // If email and password are provided, try to re-authenticate
            if (email && password) {
                const credential = EmailAuthProvider.credential(email, password);
                await reauthenticateWithCredential(auth.currentUser!, credential);
                // Retry deletion after re-authentication
                await deleteUser(auth.currentUser!);
            } else {
                // Otherwise, signal to the UI that re-auth is needed
                throw new Error('REAUTH_NEEDED');
            }
        } else {
            throw error;
        }
    }
}
