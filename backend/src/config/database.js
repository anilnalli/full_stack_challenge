import { PrismaClient } from '@prisma/client';

let prisma;

/**
 * Initialize and return Prisma Client
 * Singleton pattern to avoid multiple instances
 */
export const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      errorFormat: 'pretty',
    });

    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query', (e) => {
        console.log('Query:', e.query);
        console.log('Duration:', e.duration + 'ms');
      });
    }
  }

  return prisma;
};

/**
 * Disconnect Prisma Client
 */
export const disconnectPrisma = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};
