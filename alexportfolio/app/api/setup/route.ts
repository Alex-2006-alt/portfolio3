import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      return NextResponse.json({ message: "Admin user already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin",
      }
    });

    return NextResponse.json({ message: "Admin user created! Email: admin@example.com, Password: password123" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to setup admin user" }, { status: 500 });
  }
}
