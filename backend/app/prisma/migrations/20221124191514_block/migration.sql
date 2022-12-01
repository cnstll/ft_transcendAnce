/*
  Warnings:

  - The primary key for the `channel_actions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "channel_actions" DROP CONSTRAINT "channel_actions_pkey",
ADD CONSTRAINT "channel_actions_pkey" PRIMARY KEY ("channelActionTargetId", "channelActionOnChannelId", "channelActionRequesterId", "type");
