import { hash } from '@node-rs/bcrypt';
import { PrismaClient, Admin } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const admin = {
    id: 'fafeeb2e-4783-424f-b220-321954cefb66',
    email: 'admin@admin.com',
    phone: '089999999999',
    password: await hash('admin123'),
    username: 'admin',
    fullName: 'admin',
  } satisfies Omit<Admin, 'createdAt' | 'updatedAt' | 'deletedAt'>;

  if ((await prisma.admin.count({ where: { id: admin.id } })) == 0) {
    await prisma.admin.create({
      data: admin,
    });
  }

  await prisma.$disconnect();

  process.exit(0);
}

main();
