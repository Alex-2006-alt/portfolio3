"use client";

import { useState, useEffect } from "react";
import { getSkills, createSkill, deleteSkill } from "@/app/actions/skill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Code2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    statValue: "",
    statLabel: "",
    order: 0,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const data = await getSkills();
    setSkills(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSkill(formData);
      toast.success("Skill added successfully!");
      setIsAdding(false);
      setFormData({ title: "", description: "", statValue: "", statLabel: "", order: 0 });
      fetchSkills();
    } catch (error) {
      toast.error("Failed to add skill");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteSkill(id);
      toast.success("Skill deleted");
      fetchSkills();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header Banner */}
      <div className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2070&auto=format&fit=crop"
          alt="Skills Abstract"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Manage Core Skills</h1>
              <p className="text-zinc-300 text-sm mt-1">Add or edit your technical stack highlights.</p>
            </div>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Plus className="mr-2 h-4 w-4" /> Add Skill
          </Button>
        </div>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input 
                  type="number"
                  value={formData.order} 
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Highlight Stat Value (e.g. 'React', 'Figma')</Label>
                <Input 
                  value={formData.statValue} 
                  onChange={(e) => setFormData({...formData, statValue: e.target.value})}
                  required 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Highlight Stat Label (e.g. 'Primary Framework')</Label>
                <Input 
                  value={formData.statLabel} 
                  onChange={(e) => setFormData({...formData, statLabel: e.target.value})}
                  required 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
              <Button type="submit" className="bg-white text-black">Save Skill</Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((s, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={s.id} 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col group hover:bg-white/10 transition-all hover:-translate-y-1 shadow-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-white">{s.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/40">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-zinc-400 line-clamp-3 mb-4 flex-1">{s.description}</p>
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <span className="block text-2xl font-bold text-white">{s.statValue}</span>
                <span className="text-xs text-zinc-500 uppercase font-medium tracking-wider">{s.statLabel}</span>
              </div>
              <span className="text-xs font-mono text-zinc-600">ORDER: {s.order}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
