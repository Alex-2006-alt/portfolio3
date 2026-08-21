import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection as SkillsSection } from "@/components/landing/features-section";
import { HowItWorksSection as ExperienceSection } from "@/components/landing/how-it-works-section";
import { DevelopersSection as ProjectsSection } from "@/components/landing/developers-section";
import { IntegrationsSection as TechStackSection } from "@/components/landing/integrations-section";
import { CtaSection as ContactSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { AutoScroller } from "@/components/landing/auto-scroller";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [settings, projects, experience, techStack, skills] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "default" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.techStack.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <AutoScroller threshold={60} speed={4} />
      <Navigation settings={settings} />
      <HeroSection settings={settings} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <ProjectsSection projects={projects} />
      <TechStackSection techStack={techStack} />
      <ContactSection settings={settings} />
      <FooterSection settings={settings} />
    </main>
  );
}
