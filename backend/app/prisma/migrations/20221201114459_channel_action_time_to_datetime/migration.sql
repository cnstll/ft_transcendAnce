/*
  Warnings:

  - Changed the type of `channelActionTime` on the `channel_actions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "channel_actions" DROP COLUMN "channelActionTime",
ADD COLUMN     "channelActionTime" TIMESTAMP(3) NOT NULL;
