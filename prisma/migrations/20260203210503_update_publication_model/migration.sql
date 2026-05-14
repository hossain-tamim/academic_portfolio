/*
  Warnings:

  - You are about to drop the column `citations` on the `Publication` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publication" DROP COLUMN "citations",
ADD COLUMN     "badge" TEXT,
ADD COLUMN     "issue" TEXT,
ADD COLUMN     "pages" TEXT,
ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "volume" TEXT;

-- DropTable
DROP TABLE "Project";

-- CreateIndex
CREATE INDEX "Publication_type_idx" ON "Publication"("type");
