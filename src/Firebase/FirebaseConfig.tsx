// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAI, GoogleAIBackend } from "firebase/ai";
import { firebaseConfig, RECAPTCHA_KEY } from "./FirebaseConstants";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// Initialize App Check with better mobile support
let appCheck: AppCheck | null;
try {
  appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_KEY),
    isTokenAutoRefreshEnabled: true
  });
} catch (error) {
  console.warn('App Check initialization failed:', error);
  // Continue without App Check if it fails
  appCheck = null;
}

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

export { auth, db, ai, appCheck, firebaseApp };