import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.");
    console.error("Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPassword123! node seed_admin.mjs");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters long.");
    process.exit(1);
  }

  if (password.length > 72) {
    console.error("❌ Password exceeds bcrypt 72-byte limit.");
    process.exit(1);
  }

  // Force flag check to prevent accidental overwrites
  const force = process.argv.includes('--force');

  console.log(`Checking for existing user with email: ${email}...`);
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (!force) {
      console.log(`⚠️  User ${email} already exists.`);
      console.log(`To overwrite this user's password, run the script with the --force flag.`);
      process.exit(0);
    }
    console.log(`⚠️  --force flag detected. Updating existing user...`);
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        name: 'Admin',
      },
    });
    console.log('✅ Admin user password updated!')
  } else {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
      },
    })
    console.log('✅ Admin user created!')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
