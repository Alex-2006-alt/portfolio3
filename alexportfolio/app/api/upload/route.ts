import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadRateLimiter } from "@/lib/rate-limit";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Allowed magic bytes for image formats
const ALLOWED_MAGIC_BYTES = [
  // JPEG
  [0xFF, 0xD8, 0xFF],
  // PNG
  [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  // GIF
  [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
  [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  // WebP
  [0x52, 0x49, 0x46, 0x46], // RIFF (we also check WEBP later)
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function checkMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;

  for (const signature of ALLOWED_MAGIC_BYTES) {
    let match = true;
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        match = false;
        break;
      }
    }
    
    if (match) {
      // Extra check for WebP
      if (signature[0] === 0x52 && signature[1] === 0x49 && signature[2] === 0x46 && signature[3] === 0x46) {
        if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
          return true; // RIFF + WEBP
        }
        return false;
      }
      return true;
    }
  }

  return false;
}

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting
    // Since we don't have request.ip directly in standard Request, we rate limit per user ID
    const rateLimit = uploadRateLimiter.check(`upload_${session.user.id}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many upload attempts. Try again in ${Math.ceil(rateLimit.retryAfterMs / 1000)} seconds.` },
        { status: 429 }
      );
    }

    // 3. Parse FormData
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 4. File Size Validation
    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. File Content Validation (Magic Bytes)
    if (!checkMagicBytes(buffer)) {
       return NextResponse.json({ error: "Unsupported file type or malformed image" }, { status: 415 });
    }

    // 6. Upload to Cloudinary with restricted resource_type
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "portfolio",
            resource_type: "image", // restrict to images only, not auto
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    // Return a generic error message so we don't leak Cloudinary credentials or internal errors
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
