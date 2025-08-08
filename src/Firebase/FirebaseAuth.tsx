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
    signInAnonymously as firebaseSignInAnonymously,
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

export async function registerUsingEmailAndPassword(email: string, password: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        if (error.code === 'auth/firebase-app-check-token-is-invalid') {
            try {
                const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
                const { firebaseApp } = await import('./FirebaseConfig');
                
                const newAppCheck = initializeAppCheck(firebaseApp, {
                    provider: new ReCaptchaV3Provider('6Le2WHQrAAAAAE0AmTHSfqLnRaROoxET5A71-JSw'),
                    isTokenAutoRefreshEnabled: true
                });
                
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                return userCredential;
            } catch (retryError) {
                throw new Error('Registration failed due to App Check configuration issues. Please check your Firebase Console settings.');
            }
        }
        
        throw error;
    }
}

export async function signInAnonymously(): Promise<any> {
    try {
        const userCredential = await firebaseSignInAnonymously(auth);
        return userCredential;
    } catch (error) {
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
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  try {
    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
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
            if (email && password) {
                const credential = EmailAuthProvider.credential(email, password);
                await reauthenticateWithCredential(auth.currentUser!, credential);
                await deleteUser(auth.currentUser!);
            } else {
                throw new Error('REAUTH_NEEDED');
            }
        } else {
            throw error;
        }
    }
}
