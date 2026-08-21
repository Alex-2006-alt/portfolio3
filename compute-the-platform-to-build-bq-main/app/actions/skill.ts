"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  const skill = await prisma.skill.create({
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
}

export async function updateSkill(id: string, data: any) {
  const skill = await prisma.skill.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
