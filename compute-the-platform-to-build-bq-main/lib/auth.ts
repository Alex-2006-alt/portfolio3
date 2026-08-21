import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "***REMOVED***",
  session: {
    strategy: "jwt",
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

        const cleanEmail = credentials.email.trim().toLowerCase()

        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: cleanEmail,
              mode: "insensitive",
            },
          },
        })

        if (!user) {
          console.log(`Login attempt failed: user not found (${cleanEmail})`)
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password.trim(), user.password)

        if (!isPasswordValid) {
          console.log(`Login attempt failed: incorrect password for (${cleanEmail})`)
          return null
        }

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
