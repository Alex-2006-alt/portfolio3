import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { loginRateLimiter } from "./rate-limit"

// Fail loudly if NEXTAUTH_SECRET is missing — never fall back to a hard-coded value.
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET environment variable is not set. " +
    "Generate one with: openssl rand -base64 32"
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    // Sessions expire after 24 hours
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Normalize email — trim and lowercase
        const cleanEmail = credentials.email.trim().toLowerCase()

        // Apply Rate Limiting
        const rateLimit = loginRateLimiter.check(cleanEmail)
        if (!rateLimit.allowed) {
          console.log(`Rate limit exceeded for ${cleanEmail}. Retry after ${Math.ceil(rateLimit.retryAfterMs / 1000)}s`)
          throw new Error("Too many login attempts. Please try again later.")
        }

        // Find user by email
        const user = await prisma.user.findFirst({
          where: {
            email: cleanEmail,
          },
        })

        if (!user) {
          // Generic log — do not reveal whether the email exists
          console.log("Login attempt failed for provided credentials")
          return null
        }

        // Do NOT trim the password — preserve it exactly as entered.
        // bcryptjs silently truncates at 72 bytes; validation happens at account creation.
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          // Same generic log message — no distinction from "user not found"
          console.log("Login attempt failed for provided credentials")
          return null
        }

        // Reset rate limiter on successful login
        loginRateLimiter.reset(cleanEmail)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
}
