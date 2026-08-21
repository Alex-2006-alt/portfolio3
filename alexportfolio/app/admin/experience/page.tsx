"use client";

import { useState, useEffect } from "react";
import { getExperiences, createExperience, deleteExperience } from "@/app/actions/experience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ExperienceAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    date: "",
    description: "",
    order: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getExperiences();
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExperience(formData);
      toast.success("Experience added!");
      setIsAdding(false);
      setFormData({ title: "", role: "", date: "", description: "", order: 0 });
      fetchItems();
    } catch (error) {
      toast.error("Failed to add experience");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteExperience(id);
      toast.success("Experience deleted");
      fetchItems();
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
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
          alt="Experience Abstract"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <BriefcaseBusiness className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Manage Experience</h1>
              <p className="text-zinc-300 text-sm mt-1">Track your professional journey and roles.</p>
            </div>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Plus className="mr-2 h-4 w-4" /> Add Experience
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
                <Label>Company / Organization Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Role / Position</Label>
                <Input 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required 
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Date / Duration</Label>
              <Input 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required 
                placeholder="e.g. Jan 2022 - Present"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className="bg-zinc-900 border-zinc-800 h-24"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
              <Button type="submit" className="bg-white text-black">Save Experience</Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={item.id} 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex justify-between items-start group hover:bg-white/10 transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                <span className="text-zinc-400 font-mono text-sm px-3 py-1 bg-white/10 rounded-full">{item.date}</span>
              </div>
              <p className="text-zinc-300 font-medium mb-3">{item.role}</p>
              <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">{item.description}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="p-12 text-center text-zinc-500 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            No experience added yet.
          </div>
        )}
      </div>
    </motion.div>
  );
}
