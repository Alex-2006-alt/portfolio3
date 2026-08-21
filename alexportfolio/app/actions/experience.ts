"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExperiences() {
  return await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createExperience(data: any) {
  const exp = await prisma.experience.create({
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return exp;
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
