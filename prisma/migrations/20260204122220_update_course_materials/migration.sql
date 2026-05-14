-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "creditHours" INTEGER,
ADD COLUMN     "materials" JSONB,
ADD COLUMN     "syllabus" TEXT;

-- CreateIndex
CREATE INDEX "Course_semesterId_idx" ON "Course"("semesterId");
