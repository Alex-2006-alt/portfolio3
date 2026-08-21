"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createProject(data: {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  order?: number;
}) {
  const project = await prisma.project.create({
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return project;
}

export async function updateProject(id: string, data: any) {
  const project = await prisma.project.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return project;
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
