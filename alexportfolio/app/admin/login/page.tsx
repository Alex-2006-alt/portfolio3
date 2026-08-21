"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display text-white mb-2">Admin Login</h1>
          <p className="text-sm text-zinc-400">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-200 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
