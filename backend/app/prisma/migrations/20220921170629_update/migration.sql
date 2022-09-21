-- AlterTable
ALTER TABLE "MatchHistory" ADD COLUMN     "score" JSONB NOT NULL DEFAULT '{"player1" : 0, "player2" : 0}';
