"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function updateSettings(data: any) {
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return settings;
}
