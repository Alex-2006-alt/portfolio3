"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getUsers() {
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
  try {
    const { email, password, name } = data;
    
    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password || "password", 10);

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
    return { success: false, error: "Failed to create user. Email might already exist." };
  }
}

export async function updateUser(id: string, data: { email: string; password?: string; name?: string }) {
  try {
    const { email, password, name } = data;
    
    const updateData: any = { email, name };
    
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
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
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
