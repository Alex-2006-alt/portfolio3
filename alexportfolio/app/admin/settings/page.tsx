"use client";

import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SettingsAdmin() {
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSub: "",
    aboutText: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    yearsExperience: "5+",
    projectsCompleted: "50+",
    clientSatisfaction: "100%",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      if (data) setFormData(data as any);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-4xl"
    >
      {/* Header Banner */}
      <div className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
          alt="Settings Abstract"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">General Settings</h1>
            <p className="text-zinc-300 text-sm mt-1">Configure your portfolio content and links.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 shadow-xl">
        
        <div className="space-y-4">
          <h2 className="text-xl font-display text-white border-b border-white/10 pb-2">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Hero Title (Name)</Label>
              <Input 
                value={formData.heroTitle} 
                onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Hero Subtitle (Role)</Label>
              <Input 
                value={formData.heroSub} 
                onChange={(e) => setFormData({...formData, heroSub: e.target.value})}
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <Label className="text-zinc-300">About Text</Label>
            <Textarea 
              value={formData.aboutText} 
              onChange={(e) => setFormData({...formData, aboutText: e.target.value})}
              className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 h-32 focus:border-white/30"
            />
          </div>

          <h3 className="text-lg font-display text-white mt-6 pt-6 border-t border-white/10">Hero Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Years Experience</Label>
              <Input 
                value={formData.yearsExperience} 
                onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                placeholder="e.g. 5+"
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Projects Completed</Label>
              <Input 
                value={formData.projectsCompleted} 
                onChange={(e) => setFormData({...formData, projectsCompleted: e.target.value})}
                placeholder="e.g. 50+"
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Client Satisfaction</Label>
              <Input 
                value={formData.clientSatisfaction} 
                onChange={(e) => setFormData({...formData, clientSatisfaction: e.target.value})}
                placeholder="e.g. 100%"
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 mt-6">
          <h2 className="text-xl font-display text-white border-b border-white/10 pb-2">Social & Contact Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Email Address</Label>
              <Input 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">GitHub URL</Label>
              <Input 
                value={formData.githubUrl} 
                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">LinkedIn URL</Label>
              <Input 
                value={formData.linkedinUrl} 
                onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Twitter / X URL</Label>
              <Input 
                value={formData.twitterUrl} 
                onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})}
                className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 flex justify-end border-t border-white/10">
          <Button type="submit" className="bg-white text-black hover:bg-zinc-200 px-8">Save Settings</Button>
        </div>
      </form>
    </motion.div>
  );
}
