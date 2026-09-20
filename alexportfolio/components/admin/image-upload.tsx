"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X, Loader2, Link2, UploadCloud, Check } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
      toast.success("Image uploaded to Cloudinary successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image to Cloudinary");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = manualUrl.trim();
    if (url) {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          toast.error("URL must start with http:// or https://");
          return;
        }
        onChange(url);
        setManualUrl("");
        setShowUrlInput(false);
        toast.success("Image URL updated!");
      } catch (err) {
        toast.error("Invalid URL format");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        <div className="relative w-full h-[220px] rounded-xl overflow-hidden border border-white/15 bg-black/40 group shadow-lg">
          <div className="z-20 absolute top-3 right-3 flex gap-2">
            <Button
              type="button"
              onClick={() => onChange("")}
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-xs text-zinc-300 truncate">
            {value.includes("cloudinary.com") ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <Check className="h-3.5 w-3.5" /> Hosted on Cloudinary
              </span>
            ) : (
              <span className="text-zinc-400 truncate block">{value}</span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-white/15 hover:border-white/40 bg-zinc-950/60 hover:bg-zinc-900/60 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
              isUploading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
                <p className="text-sm text-zinc-300">Uploading to Cloudinary...</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-white/5 rounded-full border border-white/10 text-white">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Click to upload to Cloudinary
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    PNG, JPG, WEBP, GIF up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>Or paste an image URL</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="h-7 text-xs text-zinc-400 hover:text-white"
            >
              <Link2 className="h-3.5 w-3.5 mr-1" />
              {showUrlInput ? "Hide URL input" : "Enter URL"}
            </Button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2 pt-1">
              <Input
                placeholder="https://..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-sm"
              />
              <Button 
                type="button" 
                onClick={handleManualUrlSubmit}
                variant="outline"
                className="border-zinc-800 text-white hover:bg-zinc-800 shrink-0"
              >
                Set URL
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
