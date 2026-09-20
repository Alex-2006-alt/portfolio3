"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function getStats() {
  await requireAdmin();

  const [projects, techStack, skills, experience] = await Promise.all([
    prisma.project.count(),
    prisma.techStack.count(),
    prisma.skill.count(),
    prisma.experience.count(),
  ]);
  
  return {
    projects,
    techStack,
    skills,
    experience,
  };
}
