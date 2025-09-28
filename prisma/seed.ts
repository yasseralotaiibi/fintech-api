import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.consent.createMany({
    data: [
      {
        clientId: 'demo-client',
        customerId: '1234567890',
        scopes: ['accounts:read', 'payments:read'],
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error('Failed to run seed script', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
