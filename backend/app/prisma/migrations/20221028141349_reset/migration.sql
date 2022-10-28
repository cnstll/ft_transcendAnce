/*
  Warnings:

  - Made the column `name` on table `channels` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "channels" ALTER COLUMN "name" SET NOT NULL;
