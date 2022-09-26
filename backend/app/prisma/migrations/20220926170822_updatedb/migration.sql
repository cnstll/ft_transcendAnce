/*
  Warnings:

  - You are about to drop the `MatchHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MatchHistoryToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChanelPrivilegeCode" AS ENUM ('ADMIN', 'USER', 'OWNER');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'REQUESTED', 'ACCEPTED', 'REFUSED');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED', 'DIRECTMESSAGE');

-- DropForeignKey
ALTER TABLE "_MatchHistoryToUser" DROP CONSTRAINT "_MatchHistoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MatchHistoryToUser" DROP CONSTRAINT "_MatchHistoryToUser_B_fkey";

-- DropTable
DROP TABLE "MatchHistory";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_MatchHistoryToUser";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matches" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "score" JSONB NOT NULL DEFAULT '{"player1" : 0, "player2" : 0}',

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_nickName_key" ON "Users"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_user_id_friend_id_key" ON "Friends"("user_id", "friend_id");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
