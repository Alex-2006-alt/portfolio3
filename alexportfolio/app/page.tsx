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
import { getGithubProjects } from "@/lib/github";

export default async function Home() {
  const [settings, projects, experience, techStack, skills] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "default" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.techStack.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
  ]);

  const githubProjects = await getGithubProjects(settings?.githubUrl || "");

  // Merge logic: DB projects override GitHub projects with the same title
  const mergedProjectsMap = new Map();

  // Add all DB projects first (they take precedence)
  projects.forEach((p) => {
    mergedProjectsMap.set(p.title.toLowerCase(), p);
  });

  // Add GitHub projects if they don't already exist in the DB
  githubProjects.forEach((gh) => {
    const key = gh.title.toLowerCase();
    if (!mergedProjectsMap.has(key)) {
      mergedProjectsMap.set(key, gh);
    } else {
      // If DB project exists but has no link, use GitHub link
      const existing = mergedProjectsMap.get(key);
      if (!existing.link) {
        existing.link = gh.link;
      }
    }
  });

  // Convert map to array and sort by order (DB projects retain their set order)
  const finalProjects = Array.from(mergedProjectsMap.values()).sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <AutoScroller threshold={60} speed={4} />
      <Navigation settings={settings} />
      <HeroSection settings={settings} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <ProjectsSection projects={finalProjects} />
      <TechStackSection techStack={techStack} />
      <ContactSection settings={settings} />
      <FooterSection settings={settings} />
    </main>
  );
}
