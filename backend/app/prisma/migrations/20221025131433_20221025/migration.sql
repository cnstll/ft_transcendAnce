/*
  Warnings:

  - You are about to drop the column `twoFactorAuthenticationSecret` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorAuthenticationSet` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_twoFactorAuthenticationSecret_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "twoFactorAuthenticationSecret",
DROP COLUMN "twoFactorAuthenticationSet",
ADD COLUMN     "twoFactorAuthentificationSecret" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "twoFactorAuthentificationSet" BOOLEAN NOT NULL DEFAULT false;
