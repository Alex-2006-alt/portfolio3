"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Briefcase, Settings, Clock, Layers, LogOut, Code2, Users, Home } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Experience', href: '/admin/experience', icon: Clock },
    { name: 'Skills', href: '/admin/skills', icon: Code2 },
    { name: 'Tech Stack', href: '/admin/tech-stack', icon: Layers },
    { name: 'Admins', href: '/admin/admins', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen text-white flex relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/90" />
      </div>

      <div className="relative z-20 w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col">
        <div className="mb-8">
          <Link href="/admin" className="text-xl font-display font-bold">
            Portfolio Admin
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-white/10 mt-auto space-y-2">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <Home size={18} className="mr-3" />
              View Site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/5"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-auto">
        <main className="p-8 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
