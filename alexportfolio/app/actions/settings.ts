"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { settingsUpdateSchema } from "@/lib/validation";

export async function getSettings() {
  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: "default",
      }
    });
  }

  return settings;
}

export async function updateSettings(data: {
  heroTitle?: string;
  heroSub?: string;
  aboutText?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  yearsExperience?: string;
  projectsCompleted?: string;
  clientSatisfaction?: string;
}) {
  await requireAdmin();

  const parsed = settingsUpdateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: { id: "default", ...parsed.data },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return settings;
}
