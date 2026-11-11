import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "wooden_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // Phiên hết hạn sau 8 giờ

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET || "wooden-decor-secret-key-2026-change-in-production";
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  userId: string;
  email: string;
  name: string;
}

export async function createAdminToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      userId: String(payload.userId || ""),
      email: String(payload.email || ""),
      name: String(payload.name || "Chủ cửa hàng"),
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getCookieMaxAge(): number {
  return SESSION_DURATION_SECONDS;
}
