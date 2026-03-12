import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "mita-admin-token";
const BCRYPT_ROUNDS = 12;

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

/** Hash a plaintext password */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/** Verify a plaintext password against a hash */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a signed JWT token (7 days expiry) */
export async function createToken(
  adminId: string,
  email: string
): Promise<string> {
  return new SignJWT({ adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

/** Verify a JWT token and return the payload */
export async function verifyToken(
  token: string
): Promise<{ adminId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
