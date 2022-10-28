/*
  Warnings:
  - A unique constraint covering the columns `[name]` on the table `channels` will be added. If there are existing duplicate values, this will fail.
*/
-- AlterTable
ALTER TABLE "bans" ALTER COLUMN "banRequesterId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");