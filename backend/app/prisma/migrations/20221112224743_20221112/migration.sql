/*
  Warnings:

  - Added the required column `description` to the `achievements` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `achievements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "achievements" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "image" SET NOT NULL;
