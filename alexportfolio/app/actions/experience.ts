"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { experienceCreateSchema, idSchema } from "@/lib/validation";

export async function getExperiences() {
  return await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createExperience(data: {
  title: string;
  role: string;
  date: string;
  description: string;
  order?: number;
}) {
  await requireAdmin();

  const parsed = experienceCreateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const exp = await prisma.experience.create({
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return exp;
}

export async function deleteExperience(id: string) {
  await requireAdmin();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID");
  }

  await prisma.experience.delete({
    where: { id: parsedId.data },
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
