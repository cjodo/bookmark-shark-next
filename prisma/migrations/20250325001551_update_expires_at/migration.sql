-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET DEFAULT '/placeholder-avatar.png';
