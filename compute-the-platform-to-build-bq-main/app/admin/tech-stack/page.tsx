"use client";

import { useState, useEffect } from "react";
import { getTechStack, createTechStack, deleteTechStack } from "@/app/actions/tech";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Cpu } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function TechStackAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    iconName: "",
    order: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getTechStack();
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTechStack(formData);
      toast.success("Tech item added!");
      setIsAdding(false);
      setFormData({ name: "", category: "", iconName: "", order: 0 });
      fetchItems();
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteTechStack(id);
      toast.success("Item deleted");
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
          src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop"
          alt="Tech Stack Abstract"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Manage Tech Stack</h1>
              <p className="text-zinc-300 text-sm mt-1">Organize your tools and technologies.</p>
            </div>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Plus className="mr-2 h-4 w-4" /> Add Tech
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
                <Label>Technology Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                  placeholder="e.g. React"
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required 
                  placeholder="e.g. Frontend"
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
              <Button type="submit" className="bg-white text-black">Save Tech</Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 border-b border-white/10 text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                <td className="px-6 py-4 text-zinc-400">{item.category}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                  No tech stack items added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
