import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";

/**
 * Get a Firestore document by collection path and document ID.
 */
export async function getDocument(collectionPath: string, docId: string): Promise<any> {
  const docRef = doc(db, collectionPath, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

/**
 * Add or overwrite a Firestore document by collection path and document ID.
 */
export async function addDocument(collectionPath: string, docId: string, data: any): Promise<void> {
  const docRef = doc(db, collectionPath, docId);
  await setDoc(docRef, data);
}

/**
 * Delete a Firestore document by collection path and document ID.
 */
export async function deleteDocument(collectionPath: string, docId: string): Promise<void> {
  const docRef = doc(db, collectionPath, docId);
  await deleteDoc(docRef);
}
