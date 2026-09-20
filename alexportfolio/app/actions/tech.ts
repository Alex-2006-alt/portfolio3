"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { techStackCreateSchema, idSchema } from "@/lib/validation";

export async function getTechStack() {
  return await prisma.techStack.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createTechStack(data: {
  name: string;
  category: string;
  iconName?: string;
  order?: number;
}) {
  await requireAdmin();

  const parsed = techStackCreateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const item = await prisma.techStack.create({
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/admin/tech-stack");
  return item;
}

export async function deleteTechStack(id: string) {
  await requireAdmin();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID");
  }

  await prisma.techStack.delete({
    where: { id: parsedId.data },
  });
  revalidatePath("/");
  revalidatePath("/admin/tech-stack");
}
