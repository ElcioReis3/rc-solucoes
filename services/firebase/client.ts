"use client";

/**
 * Firebase CLIENT SDK — browser-only, used exclusively for the admin login
 * screen (Firebase Auth's signInWithEmailAndPassword). The storefront and
 * every data read/write go through the server (services/firebase/admin.ts),
 * so this file intentionally does NOT touch Firestore or Storage: nothing
 * about products or partners is ever fetched directly from the browser,
 * which is also why the Firestore/Storage security rules can stay fully
 * locked down (see firestore.rules / storage.rules).
 */
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseClientApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseClientApp());
}
