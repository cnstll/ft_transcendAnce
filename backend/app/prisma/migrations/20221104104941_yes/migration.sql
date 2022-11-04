/*
  Warnings:

  - You are about to drop the `matches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_matches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_matches" DROP CONSTRAINT "user_matches_matchId_fkey";

-- DropForeignKey
ALTER TABLE "user_matches" DROP CONSTRAINT "user_matches_playerId_fkey";

-- DropTable
DROP TABLE "matches";

-- DropTable
DROP TABLE "user_matches";

-- CreateTable
CREATE TABLE "Match" (
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "p1s" INTEGER NOT NULL,
    "p2s" INTEGER NOT NULL,
    "playerOneId" TEXT NOT NULL,
    "playerTwoId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("gameId")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
