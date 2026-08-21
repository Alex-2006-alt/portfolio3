"use client";

import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit, Users } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    if (data.success && data.users) {
      setUsers(data.users);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updateUser(editingId, formData);
        if (res.success) {
          toast.success("Admin updated successfully!");
        } else {
          toast.error(res.error || "Failed to update admin");
        }
      } else {
        const res = await createUser(formData);
        if (res.success) {
          toast.success("Admin created successfully!");
        } else {
          toast.error(res.error || "Failed to create admin");
        }
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name || "",
      email: user.email,
      password: "",
    });
    setEditingId(user.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to delete the admin: ${email}?`)) {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success("Admin deleted");
        fetchUsers();
      } else {
        toast.error("Failed to delete admin");
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="relative w-full h-40 md:h-56 rounded-2xl overflow-hidden border border-white/10">
        <img
          src="/images/audit.jpg"
          alt="Admins Abstract"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Manage Admins</h1>
              <p className="text-zinc-300 text-sm mt-1">Control access to your portfolio.</p>
            </div>
          </div>
          <Button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: "", email: "", password: "" }); }} className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Plus className="mr-2 h-4 w-4" /> Add Admin
          </Button>
        </div>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          <h2 className="text-xl font-bold mb-4 text-white">{editingId ? "Edit Admin" : "Create New Admin"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-zinc-900 border-zinc-800"
                  placeholder="e.g. Samiran Bera"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                  className="bg-zinc-900 border-zinc-800"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Password {editingId && <span className="text-zinc-500 text-sm">(Leave blank to keep current password)</span>}</Label>
              <Input 
                type="password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingId}
                className="bg-zinc-900 border-zinc-800"
                placeholder="********"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} className="border-white/10 text-white hover:bg-white/10">Cancel</Button>
              <Button type="submit" className="bg-white text-black">{editingId ? "Save Changes" : "Create Admin"}</Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={u.id} 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col group hover:bg-white/10 transition-colors shadow-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-white">{u.name || "Unnamed Admin"}</h3>
                <p className="text-sm text-zinc-400">{u.email}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(u)} className="text-zinc-400 hover:text-white">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id, u.email)} className="text-red-400 hover:text-red-300 hover:bg-red-900/40">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
