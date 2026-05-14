-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "citations" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Publication_year_idx" ON "Publication"("year");

-- CreateIndex
CREATE INDEX "Publication_featured_idx" ON "Publication"("featured");
