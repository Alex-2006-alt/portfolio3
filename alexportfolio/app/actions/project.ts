"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { projectCreateSchema, projectUpdateSchema, idSchema } from "@/lib/validation";

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
  await requireAdmin();

  const parsed = projectCreateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const project = await prisma.project.create({
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return project;
}

export async function updateProject(id: string, data: {
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  order?: number;
}) {
  await requireAdmin();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID");
  }

  const parsed = projectUpdateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const project = await prisma.project.update({
    where: { id: parsedId.data },
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return project;
}

export async function deleteProject(id: string) {
  await requireAdmin();

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID");
  }

  await prisma.project.delete({
    where: { id: parsedId.data },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
