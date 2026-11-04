import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

export { SESSION_COOKIE_NAME };
// Admin fica logado por 12h, depois precisa entrar com e-mail/senha de novo.
const SESSION_EXPIRES_IN_MS = 12 * 60 * 60 * 1000; // 12 horas

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

  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    return decoded;
  } catch {
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
