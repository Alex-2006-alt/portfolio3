"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTechStack() {
  return await prisma.techStack.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createTechStack(data: any) {
  const item = await prisma.techStack.create({
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/tech-stack");
  return item;
}

export async function deleteTechStack(id: string) {
  await prisma.techStack.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin/tech-stack");
}
