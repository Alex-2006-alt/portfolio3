"use server";
import { prisma } from "@/lib/prisma";

export async function getStats() {
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
