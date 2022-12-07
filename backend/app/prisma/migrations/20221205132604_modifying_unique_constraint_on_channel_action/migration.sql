/*
  Warnings:

  - A unique constraint covering the columns `[channelActionTargetId,channelActionOnChannelId,type]` on the table `channel_actions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "channel_actions_channelActionTargetId_channelActionOnChanne_key";

-- CreateIndex
CREATE UNIQUE INDEX "channel_actions_channelActionTargetId_channelActionOnChanne_key" ON "channel_actions"("channelActionTargetId", "channelActionOnChannelId", "type");
