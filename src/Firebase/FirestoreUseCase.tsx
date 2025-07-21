import { db } from "./FirebaseConfig";
import { USER_ATTEMPTS_COLLECTION, MAIN_CONSTANTS_COLLECTION, MAIN_CONSTANTS_DOCUMENT } from "../Receipt/Constants";
import { UserAttemptsData, ReceiptConstantsData } from "../Receipt/FirestoreData";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export async function getUserAttempts(userId: string) {
    const userAttemptsRef = doc(db, USER_ATTEMPTS_COLLECTION, userId);
    return getDoc(userAttemptsRef).then((docSnap) => {
        if (docSnap.exists()) {
            return docSnap.data() as UserAttemptsData;
        }
        return null;
    });
}

    
export async function getMainConstantsForReceipts() {
    const mainConstantsRef = doc(db, MAIN_CONSTANTS_COLLECTION, MAIN_CONSTANTS_DOCUMENT);
    return getDoc(mainConstantsRef).then((docSnap) => {
        if (docSnap.exists()) {
            return docSnap.data() as ReceiptConstantsData;
        }
        return null;
    });
}

export async function updateUserAttempts(userId: string, data: UserAttemptsData) {
    const userAttemptsRef = doc(db, USER_ATTEMPTS_COLLECTION, userId);
    await setDoc(userAttemptsRef, data, { merge: true });
}

export async function deleteUserAttempts(userId: string) {
    const userAttemptsRef = doc(db, USER_ATTEMPTS_COLLECTION, userId);
    await deleteDoc(userAttemptsRef);
}

