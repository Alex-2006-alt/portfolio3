"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

export function HowItWorksSection({ experience }: { experience?: any[] }) {
  const router = useRouter();
  const experiences = experience && experience.length > 0 ? experience : [
    {
      title: "Senior Full Stack Engineer",
      role: "TechNova Solutions",
      date: "Jan 2022 - Present",
      description: "Led a team of 5 engineers to rebuild the core customer portal using Next.js and Tailwind CSS. Improved page load times by 40% and reduced technical debt by migrating from a legacy monolith to a microservices architecture."
    },
    {
      title: "Frontend Developer",
      role: "Creative Digital Agency",
      date: "Mar 2019 - Dec 2021",
      description: "Developed and maintained highly interactive web applications for clients in the e-commerce sector. Implemented complex animations with Framer Motion and ensured cross-browser compatibility and accessibility."
    }
  ];

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[oklch(0.09_0.01_260)] text-white overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header — titre + image cerisier */}
        <div className="relative mb-20 lg:mb-32 grid lg:grid-cols-2 gap-4 lg:gap-12 items-end">
          {/* Titre colonne gauche */}
          <div className="overflow-hidden pb-0 lg:pb-32">
            <div className={`transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-white/40 mb-8">
                <span className="w-12 h-px bg-white/20" />
                Experience
              </span>
            </div>
            
            <h2 className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.85] transition-all duration-1000 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}>
              <span className="block">Learn.</span>
              <span className="block text-white/30">Build.</span>
              <span className="block text-white/10">Grow.</span>
            </h2>
          </div>

          {/* Image cerisier — se colle en bas sur les blocs */}
          <div className={`relative h-[320px] lg:h-[640px] overflow-hidden transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tree-uAia6REvB137CQyHFCf0za3O6h2zKO.png"
              alt=""
              aria-hidden="true"
              className="absolute bottom-0 left-0 w-full h-full object-contain object-bottom"
            />
            {/* Fade sur le bord gauche */}
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.09_0.01_260)] via-transparent to-transparent pointer-events-none" />
            {/* Secret admin login area */}
            <div 
              onDoubleClick={() => router.push('/admin')}
              className="absolute bottom-0 left-0 w-full h-1/4 z-20 cursor-default"
            />
          </div>
        </div>

        {/* Experience List */}
        <div className="space-y-16">
          {experiences.map((exp, index) => (
            <div key={index} className="relative flex flex-col md:flex-row gap-8 md:gap-12 group">
              {/* Timeline node */}
              <div className="absolute left-[-24px] md:left-auto md:right-[calc(100%+32px)] top-2 h-4 w-4 rounded-full border-2 border-zinc-700 bg-black group-hover:border-white group-hover:bg-white transition-colors duration-300 z-10 hidden md:block" />
              
              {/* Content */}
              <div className="flex-1 md:text-right">
                <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300">
                  {exp.title}
                </h3>
                <p className="text-zinc-500 font-mono text-sm mb-4">{exp.date}</p>
              </div>
              
              <div className="flex-[2] bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-2xl hover:border-zinc-700 transition-colors duration-300">
                <h4 className="text-lg text-zinc-300 font-medium mb-3">{exp.role}</h4>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 6s linear forwards;
        }
      `}</style>
    </section>
  );
}
