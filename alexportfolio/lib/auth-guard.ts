"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

/**
 * Shared server-side authorization helper.
 * Call this at the top of every admin Server Action and API route.
 *
 * - Validates the JWT session exists
 * - Verifies the user still exists in the database (catches deleted accounts)
 * - Returns the verified user record (id, email, name)
 * - Throws a generic error on failure — never reveals whether the account exists
 */
export async function requireAdmin(): Promise<{
  id: string;
  email: string;
  name: string | null;
}> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify the user still exists in the database.
  // A deleted admin must not retain access through an old JWT.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
