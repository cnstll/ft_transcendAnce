/*
  Warnings:

  - The values [BLOCK] on the enum `ChannelActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChannelActionType_new" AS ENUM ('BAN', 'MUTE');
ALTER TABLE "channel_actions" ALTER COLUMN "type" TYPE "ChannelActionType_new" USING ("type"::text::"ChannelActionType_new");
ALTER TYPE "ChannelActionType" RENAME TO "ChannelActionType_old";
ALTER TYPE "ChannelActionType_new" RENAME TO "ChannelActionType";
DROP TYPE "ChannelActionType_old";
COMMIT;

-- CreateTable
CREATE TABLE "blocked" (
    "channelBlockedTargetId" TEXT NOT NULL,
    "channelBlockedRequesterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocked_pkey" PRIMARY KEY ("channelBlockedTargetId","channelBlockedRequesterId")
);

-- CreateIndex
CREATE UNIQUE INDEX "blocked_channelBlockedRequesterId_channelBlockedTargetId_key" ON "blocked"("channelBlockedRequesterId", "channelBlockedTargetId");

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_channelBlockedTargetId_fkey" FOREIGN KEY ("channelBlockedTargetId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_channelBlockedRequesterId_fkey" FOREIGN KEY ("channelBlockedRequesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
