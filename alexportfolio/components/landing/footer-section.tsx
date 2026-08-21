"use client";

import { ArrowUpRight, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";

const footerLinks = {
  Navigation: [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
  ],
};

function AnimatedWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(100, 200, 150, 0.3)";
      ctx.lineWidth = 1;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.5 +
            Math.sin(x * 0.01 + time + wave * 0.5) * 30 +
            Math.sin(x * 0.02 + time * 1.5 + wave) * 20;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export function FooterSection({ settings }: { settings?: any }) {
  const title = settings?.heroTitle || "John Doe";
  const email = settings?.email || "hello@example.com";
  const github = settings?.githubUrl || "#";
  const linkedin = settings?.linkedinUrl || "#";
  const twitter = settings?.twitterUrl || "#";
  
  return (
    <footer className="relative bg-black">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png"
          alt="Bioluminescent landscape"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient fade to black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {/* Subtle dark vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Main Info */}
          <div className="col-span-1 md:col-span-4 lg:col-span-5 space-y-8">
            <div>
              <Link href="/" className="inline-block">
                <span className="text-2xl font-display font-bold text-white tracking-tight">{title}</span>
              </Link>
              <p className="mt-4 text-zinc-400 max-w-sm text-sm leading-relaxed">
                Building digital experiences that inspire and engage. Let's create something amazing together.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link href={github} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300">
                <Github size={18} />
              </Link>
              <Link href={twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300">
                <Twitter size={18} />
              </Link>
              <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300">
                <Linkedin size={18} />
              </Link>
              <Link href={`mailto:${email}`} className="h-10 w-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300">
                <Mail size={18} />
              </Link>
            </div>
          </div>

            {/* Link Columns */}
            <div>
              <h3 className="text-sm font-medium text-white mb-6">Navigation</h3>
              <ul className="space-y-4">
                {footerLinks.Navigation.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-6">Connect</h3>
              <ul className="space-y-4">
                <li>
                  <a href={`mailto:${email}`} className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2">
                    Email
                  </a>
                </li>
                <li>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href={github} target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {title}. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eca8d6]" />
              Available for work
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
