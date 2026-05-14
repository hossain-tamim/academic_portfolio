-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "paperUrl" TEXT,
ADD COLUMN     "tags" TEXT;

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");
