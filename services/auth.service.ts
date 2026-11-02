import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

export { SESSION_COOKIE_NAME };
// Admin stays logged in for 12h, then must sign in again.
const SESSION_EXPIRES_IN_MS = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Exchanges a freshly-signed-in Firebase ID token for a long-lived, HTTP-only
 * session cookie. Called from the /api/auth/session route right after the
 * client signs in with email/password.
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  return getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN_MS,
  });
}

/**
 * Verifies the current request's session cookie. Returns the decoded admin
 * user, or null when there is no session or it is invalid/expired/revoked.
 * This is the one real authorization check — every admin page and every
 * server action calls this before touching any data.
 */
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  // DIAGNÓSTICO TEMPORÁRIO: mostra se é essa chamada que nunca volta. Pode remover depois.
  console.log("[diag] verifySessionCookie: começando...");
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    console.log("[diag] verifySessionCookie: OK");
    return decoded;
  } catch (err) {
    console.log("[diag] verifySessionCookie: falhou -", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Throws if there is no valid admin session. Use at the top of every server action. */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}
