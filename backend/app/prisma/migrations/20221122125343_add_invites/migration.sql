-- CreateTable
CREATE TABLE "_inviteOnChannel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_inviteOnChannel_AB_unique" ON "_inviteOnChannel"("A", "B");

-- CreateIndex
CREATE INDEX "_inviteOnChannel_B_index" ON "_inviteOnChannel"("B");

-- AddForeignKey
ALTER TABLE "_inviteOnChannel" ADD CONSTRAINT "_inviteOnChannel_A_fkey" FOREIGN KEY ("A") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_inviteOnChannel" ADD CONSTRAINT "_inviteOnChannel_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
