/*
  Warnings:

  - You are about to drop the `bans` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChannelActionType" AS ENUM ('BAN', 'BLOCK', 'MUTE');

-- DropForeignKey
ALTER TABLE "bans" DROP CONSTRAINT "bans_banChannelId_fkey";

-- DropForeignKey
ALTER TABLE "bans" DROP CONSTRAINT "bans_banRequesterId_fkey";

-- DropForeignKey
ALTER TABLE "bans" DROP CONSTRAINT "bans_bannedUserId_fkey";

-- DropTable
DROP TABLE "bans";

-- CreateTable
CREATE TABLE "channel_actions" (
    "channelActionTargetId" TEXT NOT NULL,
    "channelActionOnChannelId" TEXT NOT NULL,
    "channelActionTime" TIME NOT NULL,
    "type" "ChannelActionType" NOT NULL,
    "channelActionRequesterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_actions_pkey" PRIMARY KEY ("channelActionTargetId","channelActionOnChannelId","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_actions_channelActionTargetId_channelActionOnChanne_key" ON "channel_actions"("channelActionTargetId", "channelActionOnChannelId");

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionTargetId_fkey" FOREIGN KEY ("channelActionTargetId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionOnChannelId_fkey" FOREIGN KEY ("channelActionOnChannelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionRequesterId_fkey" FOREIGN KEY ("channelActionRequesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
