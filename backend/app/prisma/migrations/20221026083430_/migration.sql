/*
  Warnings:

  - The values [REFUSED] on the enum `FriendshipStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `score` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `nickName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[immutableId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nickname]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `immutableId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FriendshipStatus_new" AS ENUM ('REQUESTED', 'ACCEPTED');
ALTER TABLE "friendships" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "friendships" ALTER COLUMN "status" TYPE "FriendshipStatus_new" USING ("status"::text::"FriendshipStatus_new");
ALTER TYPE "FriendshipStatus" RENAME TO "FriendshipStatus_old";
ALTER TYPE "FriendshipStatus_new" RENAME TO "FriendshipStatus";
DROP TYPE "FriendshipStatus_old";
ALTER TABLE "friendships" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
COMMIT;

-- DropIndex
DROP INDEX "users_nickName_key";

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "user_matches" ADD COLUMN     "score" JSONB NOT NULL DEFAULT '{"myself" : 0, "opponent" : 0}';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "nickName",
ADD COLUMN     "immutableId" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "twoFactorAuthenticationSecret" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "twoFactorAuthenticationSet" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_immutableId_key" ON "users"("immutableId");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");
