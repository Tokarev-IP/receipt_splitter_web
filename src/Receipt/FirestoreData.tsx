// Firestore data structure for user attempts
export interface UserAttemptsData {
  lastAttemptTime: number; // Timestamp in milliseconds
  attempts: number;
}

// Firestore data structure for receipt constants
export interface ReceiptConstantsData {
  deltaTimeBetweenAttempts: number; // in milliseconds
  maximumAttemptsForUser: number;
  requestText: string;
  aiModel: string;
}