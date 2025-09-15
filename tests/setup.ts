import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const BASE_URL = "/realtime-polling/api/v1";

// Helper to clean DB before tests
export const resetDB = async () => {
  await prisma.vote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.user.deleteMany();
};
