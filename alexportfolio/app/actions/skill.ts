"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { skillCreateSchema, skillUpdateSchema, idSchema } from "@/lib/validation";

export async function getSkills() {
  return await prisma.skill.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createSkill(data: {
  title: string;
  description: string;
  statValue: string;
  statLabel: string;
  order?: number;
}) {
  await requireAdmin();

  const parsed = skillCreateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const skill = await prisma.skill.create({
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
}

export async function updateSkill(id: string, data: {
  title?: string;
  description?: string;
  statValue?: string;
  statLabel?: string;
  order?: number;
}) {
  await requireAdmin();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID");
  }

  const parsed = skillUpdateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const skill = await prisma.skill.update({
    where: { id: parsedId.data },
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
}

export async function deleteSkill(id: string) {
  await requireAdmin();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID");
  }

  await prisma.skill.delete({
    where: { id: parsedId.data },
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
