"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth-guard";
import { userCreateSchema, userUpdateSchema, idSchema } from "@/lib/validation";

export async function getUsers() {
  await requireAdmin();

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        // we intentionally do not select the password hash
      }
    });
    return { success: true, users };
  } catch (error) {
    console.error("Failed to get users:", error);
    return { success: false, error: "Failed to get users" };
  }
}

export async function createUser(data: { email: string; password?: string; name?: string }) {
  await requireAdmin();

  try {
    // Validate input — password is required and must be strong
    const parsed = userCreateSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
    }

    const { email, password, name } = parsed.data;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    revalidatePath("/admin/admins");
    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user." };
  }
}

export async function updateUser(id: string, data: { email: string; password?: string; name?: string }) {
  const currentAdmin = await requireAdmin();

  try {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) {
      return { success: false, error: "Invalid user ID" };
    }

    const parsed = userUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message || "Invalid input" };
    }

    const { email, password, name } = parsed.data;

    // Check the target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: parsedId.data } });
    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    // Check for email conflict with a different user
    if (email !== targetUser.email) {
      const conflict = await prisma.user.findUnique({ where: { email } });
      if (conflict) {
        return { success: false, error: "An account with this email already exists." };
      }
    }

    const updateData: { email: string; name: string; password?: string } = { email, name: name || "" };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parsedId.data },
      data: updateData,
    });

    revalidatePath("/admin/admins");
    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  const currentAdmin = await requireAdmin();

  try {
    const parsedId = idSchema.safeParse(id);
    if (!parsedId.success) {
      return { success: false, error: "Invalid user ID" };
    }

    // Prevent self-deletion
    if (parsedId.data === currentAdmin.id) {
      return { success: false, error: "You cannot delete your own account." };
    }

    // Prevent deleting the last admin
    const adminCount = await prisma.user.count();
    if (adminCount <= 1) {
      return { success: false, error: "Cannot delete the last admin account." };
    }

    // Verify user exists before deleting
    const targetUser = await prisma.user.findUnique({ where: { id: parsedId.data } });
    if (!targetUser) {
      return { success: false, error: "User not found" };
    }

    await prisma.user.delete({
      where: { id: parsedId.data },
    });

    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
