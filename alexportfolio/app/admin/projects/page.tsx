"use client";

import { useState, useEffect } from "react";
import { getProjects, createProject, deleteProject } from "@/app/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Briefcase } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    imageUrl: "",
    order: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(formData);
      toast.success("Project added successfully!");
      setIsAdding(false);
      setFormData({ title: "", description: "", link: "", imageUrl: "", order: 0 });
      fetchProjects();
    } catch (error) {
      toast.error("Failed to add project");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteProject(id);
      toast.success("Project deleted");
      fetchProjects();
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
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
          alt="Projects Abstract"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Manage Projects</h1>
              <p className="text-zinc-300 text-sm mt-1">Showcase your best work and case studies.</p>
            </div>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Plus className="mr-2 h-4 w-4" /> Add Project
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
                <Label>Link (URL)</Label>
                <Input 
                  value={formData.link} 
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
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

            <div className="space-y-2">
              <Label>Project Image</Label>
              <ImageUpload 
                value={formData.imageUrl} 
                onChange={(url) => setFormData({...formData, imageUrl: url})} 
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
              <Button type="submit" className="bg-white text-black">Save Project</Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={p.id} 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:bg-white/10 transition-all hover:-translate-y-1 shadow-lg"
          >
            {p.imageUrl && (
              <div className="h-48 w-full relative">
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{p.title}</h3>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/40">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-2">{p.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
