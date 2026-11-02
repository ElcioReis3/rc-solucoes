import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionCookie } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

/** Exchanges a Firebase ID token (from client sign-in) for an HTTP-only session cookie. */
export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Token ausente." }, { status: 400 });
  }

  try {
    const sessionCookie = await createSessionCookie(idToken);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours, matches createSessionCookie's expiresIn
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Falha ao autenticar." }, { status: 401 });
  }
}

/** Clears the session cookie (logout). */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
