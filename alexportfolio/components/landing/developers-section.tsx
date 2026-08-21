"use client";

import { useState, useEffect, useRef } from "react";

import { motion, useScroll, useTransform } from "framer-motion";

export function DevelopersSection({ projects }: { projects?: any[] }) {
  const allProjects = projects && projects.length > 0 ? projects : [
    {
      title: "Portfolio CMS",
      description: "A headless CMS built with Next.js, Prisma, and SQLite for dynamic portfolio management.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png",
      link: "#"
    },
    {
      title: "E-Commerce Storefront",
      description: "A modern storefront built with React and Tailwind CSS, featuring seamless cart interactions.",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tree-uAia6REvB137CQyHFCf0za3O6h2zKO.png",
      link: "#"
    }
  ];

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">

      {/* Image — absolute, bottom-right, behind all content */}
      <div
        className={`absolute bottom-0 right-0 w-[55%] h-[85%] pointer-events-none transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2813%29-OQ2DiR3ElVsUg8kTvTL1kC5A3Q6maM.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-left-top"
        />
        {/* Fade left edge */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        {/* Fade top edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
      </div>

      {/* All text content sits on top */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — Full width */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Featured Projects
          </span>
          <h2 className="text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9]">
            Selected
            <br />
            <span className="text-muted-foreground">works.</span>
          </h2>
        </div>

        {/* Description + Projects — left half only */}
        <div
          className={`transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-md">
            A selection of my recent work spanning full-stack development, UI/UX design, and complex web applications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full mt-12 md:mt-20">
              {allProjects.map((project, index) => (
                <div key={index} className="group relative bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-colors duration-500">
                  <div className="aspect-[4/3] relative overflow-hidden bg-zinc-900">
                    <img 
                      src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80"} 
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-display font-medium text-white mb-3">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-white hover:text-zinc-300 transition-colors">
                        View Project
                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
