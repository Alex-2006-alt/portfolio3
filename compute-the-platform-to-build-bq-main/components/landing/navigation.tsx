"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";

const navLinks = [
  { name: "About",       href: "#about"        },
  { name: "Skills",      href: "#skills"       },
  { name: "Experience",  href: "#experience"   },
  { name: "Projects",    href: "#projects"     },
  { name: "Tech Stack",  href: "#tech-stack"   },
];

export function Navigation({ settings }: { settings?: any }) {
  const title = settings?.heroTitle || "JD";
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          <Link href="/" className="relative z-50">
            <span className="text-2xl font-display font-bold text-white tracking-tight">{title}</span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors duration-300 relative group ${isScrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-foreground" : "bg-white"}`} />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6 h-full">
            <Link href="/admin" className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300">
              Admin
            </Link>
            
            <Button variant="outline" size="sm" className="hidden sm:flex border-white/20 text-white hover:bg-white hover:text-black transition-all">
              <Download className="mr-2 h-4 w-4" />
              Resume
            </Button>
            <Button
              size="sm"
              className={`rounded-full transition-all duration-500 ${isScrolled ? "bg-foreground hover:bg-foreground/90 text-background px-4 h-8 text-xs" : "bg-white hover:bg-white/90 text-black px-6"}`}
            >
              Contact Me
            </Button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors duration-500 ${isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white"}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>
      
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-white hover:text-white/70 transition-all duration-500 ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button 
              variant="outline" 
              className="flex-1 rounded-full h-14 text-base bg-transparent border-white/20 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resume
            </Button>
            <Link href="/admin" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
              <Button 
                variant="outline" 
                className="w-full h-14 text-base rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Admin
              </Button>
            </Link>
            <Button 
              className="flex-1 bg-white text-black hover:bg-white/90 rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
