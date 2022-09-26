/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MatchHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MatchHistoryToUser` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "ChannelRole" AS ENUM ('DEFAULT', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED', 'DIRECTMESSAGE');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'APPROVED', 'REFUSED');

-- DropForeignKey
ALTER TABLE "_MatchHistoryToUser" DROP CONSTRAINT "_MatchHistoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatchHistoryToUser" DROP CONSTRAINT "_MatchHistoryToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "MatchHistory";

-- DropTable
DROP TABLE "_MatchHistoryToUser";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "score" JSONB NOT NULL DEFAULT '{"player1" : 0, "player2" : 0}',

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMatch" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "UserMatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMatch" ADD CONSTRAINT "UserMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMatch" ADD CONSTRAINT "UserMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
