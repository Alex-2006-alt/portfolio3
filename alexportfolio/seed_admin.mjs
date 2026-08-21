import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = '***REMOVED***';
  const password = '***REMOVED***';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name: 'Samiran Bera',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Samiran Bera',
    },
  });
  
  console.log('Seeded default admin:', user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
