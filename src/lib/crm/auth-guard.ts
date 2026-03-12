import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { AUTH_COOKIE_NAME, verifyToken } from "./auth";

/**
 * Get the authenticated admin user from the JWT cookie.
 * Returns the AdminUser or null if not authenticated.
 * Use in server components and API routes.
 */
export async function getAuthAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.adminId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
    },
  });

  if (!admin || !admin.active) return null;

  return admin;
}

/**
 * Require authentication. Throws if not authenticated.
 * Use in API routes that need auth.
 */
export async function requireAuth() {
  const admin = await getAuthAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}
