"use client";

import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { getStats } from "@/app/actions/stats";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, techStack: 0, skills: 0, experience: 0 });

  useEffect(() => {
    getStats().then(setStats);
  }, []);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          alt="Dashboard Abstract"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-zinc-300 text-sm mt-1">Welcome to your portfolio command center.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
        >
          <h3 className="text-zinc-400 text-sm font-medium">Total Projects</h3>
          <p className="text-4xl font-display font-bold mt-2 text-white">{stats.projects}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
        >
          <h3 className="text-zinc-400 text-sm font-medium">Tech Stack Items</h3>
          <p className="text-4xl font-display font-bold mt-2 text-white">{stats.techStack}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
        >
          <h3 className="text-zinc-400 text-sm font-medium">Skills</h3>
          <p className="text-4xl font-display font-bold mt-2 text-white">{stats.skills}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
        >
          <h3 className="text-zinc-400 text-sm font-medium">Experience Items</h3>
          <p className="text-4xl font-display font-bold mt-2 text-white">{stats.experience}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
