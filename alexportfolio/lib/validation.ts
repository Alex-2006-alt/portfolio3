import { z } from "zod";

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Only allow http(s) URLs — reject javascript:, data:, etc. */
const safeUrlSchema = z
  .string()
  .max(2048, "URL is too long")
  .refine(
    (val) => {
      if (val === "") return true; // allow empty (optional URLs)
      try {
        const url = new URL(val);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "URL must start with https:// or http://" }
  );

/** Normalize email: trim whitespace + lowercase */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Common weak passwords to reject
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "admin123",
  "letmein",
  "welcome",
  "abc12345",
]);

// ─── Entity Schemas ────────────────────────────────────────────────────────

export const experienceCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  role: z.string().min(1, "Role is required").max(200, "Role too long"),
  date: z.string().min(1, "Date is required").max(100, "Date too long"),
  description: z.string().min(1, "Description is required").max(5000, "Description too long"),
  order: z.number().int().min(0).max(9999).default(0),
});

export const projectCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(5000, "Description too long"),
  imageUrl: safeUrlSchema.optional().default(""),
  link: safeUrlSchema.optional().default(""),
  order: z.number().int().min(0).max(9999).default(0),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  description: z.string().min(1, "Description is required").max(5000, "Description too long").optional(),
  imageUrl: safeUrlSchema.optional(),
  link: safeUrlSchema.optional(),
  order: z.number().int().min(0).max(9999).optional(),
});

export const skillCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description too long"),
  statValue: z.string().min(1, "Stat value is required").max(50, "Stat value too long"),
  statLabel: z.string().min(1, "Stat label is required").max(100, "Stat label too long"),
  order: z.number().int().min(0).max(9999).default(0),
});

export const skillUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  statValue: z.string().min(1).max(50).optional(),
  statLabel: z.string().min(1).max(100).optional(),
  order: z.number().int().min(0).max(9999).optional(),
});

export const techStackCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  category: z.string().min(1, "Category is required").max(100, "Category too long"),
  iconName: z.string().max(100, "Icon name too long").optional().default(""),
  order: z.number().int().min(0).max(9999).default(0),
});

export const settingsUpdateSchema = z.object({
  heroTitle: z.string().min(1).max(200).optional(),
  heroSub: z.string().min(1).max(200).optional(),
  aboutText: z.string().max(5000).optional(),
  email: z.string().email("Invalid email").max(320).optional(),
  githubUrl: safeUrlSchema.optional(),
  linkedinUrl: safeUrlSchema.optional(),
  twitterUrl: safeUrlSchema.optional(),
  yearsExperience: z.string().max(50).optional(),
  projectsCompleted: z.string().max(50).optional(),
  clientSatisfaction: z.string().max(50).optional(),
});

// ─── User / Admin Schemas ──────────────────────────────────────────────────

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters (bcrypt limit)")
  .refine(
    (val) => !COMMON_PASSWORDS.has(val.toLowerCase()),
    { message: "This password is too common. Please choose a stronger one." }
  );

export const userCreateSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(320, "Email too long")
    .email("Invalid email format")
    .transform(normalizeEmail),
  password: passwordSchema,
  name: z.string().max(200, "Name too long").optional().default(""),
});

export const userUpdateSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(320, "Email too long")
    .email("Invalid email format")
    .transform(normalizeEmail),
  password: z
    .string()
    .max(72, "Password must be at most 72 characters (bcrypt limit)")
    .optional()
    .refine(
      (val) => {
        // If password is provided and non-empty, it must meet strength requirements
        if (val && val.trim() !== "") {
          if (val.length < 8) return false;
          if (COMMON_PASSWORDS.has(val.toLowerCase())) return false;
        }
        return true;
      },
      { message: "Password must be at least 8 characters and not a common password" }
    ),
  name: z.string().max(200, "Name too long").optional().default(""),
});

/** Validate that a record ID is a non-empty string */
export const idSchema = z.string().min(1, "ID is required").max(100, "Invalid ID");
