import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.consent.deleteMany();

  const sampleConsent = await prisma.consent.create({
    data: {
      subject: '1234567890',
      clientId: 'demo-client',
      scope: ['accounts.read', 'payments.initiate'],
      status: 'active'
    }
  });

  await prisma.auditLog.create({
    data: {
      action: 'seed.initialised',
      actor: 'system',
      consentId: sampleConsent.id,
      details: { message: 'Seed data for sandbox usage' }
    }
  });
}

main()
  .catch((error) => {
    console.error('Seeding error', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
