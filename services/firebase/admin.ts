import "server-only";

/**
 * Firebase ADMIN SDK — server-only. Every read and write of products,
 * partner companies, and uploaded images goes through here, using a
 * service-account key that bypasses Firestore/Storage security rules.
 *
 * Deliberately lazy: nothing in this module touches the network or throws
 * at import time. That lets `next build` succeed even before the Firebase
 * env vars are configured — the app only needs real credentials once a
 * request actually calls one of these functions.
 */
import {
  initializeApp,
  getApps,
  getApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth, type Auth } from "firebase-admin/auth";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} environment variable. See SETUP.md for how to configure Firebase.`
    );
  }
  return value;
}

let app: App | undefined;

function getAdminApp(): App {
  if (getApps().length) return getApp();
  if (app) return app;

  const projectId = requireEnv("FIREBASE_PROJECT_ID");
  const clientEmail = requireEnv("FIREBASE_CLIENT_EMAIL");
  // Private keys are usually stored with literal "\n" sequences in env files.
  const privateKey = requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const storageBucket = requireEnv("FIREBASE_STORAGE_BUCKET");

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });

  return app;
}

let firestore: Firestore | undefined;

export function getAdminFirestore(): Firestore {
  if (firestore) return firestore;

  firestore = getFirestore(getAdminApp());
  try {
    // Deixa o código de serviço omitir campos opcionais (ex.: preço de um produto que o admin
    // não preencheu) em vez de ter que apagar cada um explicitamente antes de cada gravação.
    firestore.settings({ ignoreUndefinedProperties: true });
  } catch (err) {
    // Em dev, o Turbopack pode recarregar este módulo (zerando a variável local `firestore`)
    // enquanto a instância real do Firestore, que é por app, continua a mesma por baixo — nesse
    // caso settings() já foi aplicado antes e dá esse erro específico, que é inofensivo aqui.
    const alreadyInitialized =
      err instanceof Error && err.message.includes("already been initialized");
    if (!alreadyInitialized) throw err;
  }

  return firestore;
}

export function getAdminStorageBucket() {
  return getStorage(getAdminApp()).bucket();
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
