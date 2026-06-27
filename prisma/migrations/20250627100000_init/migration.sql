-- CreateSchema
CREATE TYPE "Language" AS ENUM ('en', 'ur');
CREATE TYPE "CorrectOption" AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE "AttemptStatus" AS ENUM ('PASS', 'FAIL');

CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "questionUr" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAltEn" TEXT,
    "imageAltUr" TEXT,
    "optionAEn" TEXT NOT NULL,
    "optionAUr" TEXT NOT NULL,
    "optionBEn" TEXT NOT NULL,
    "optionBUr" TEXT NOT NULL,
    "optionCEn" TEXT NOT NULL,
    "optionCUr" TEXT NOT NULL,
    "optionDEn" TEXT NOT NULL DEFAULT '',
    "optionDUr" TEXT NOT NULL DEFAULT '',
    "correctOption" "CorrectOption" NOT NULL,
    "explanationEn" TEXT NOT NULL DEFAULT '',
    "explanationUr" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 20,
    "correctAnswers" INTEGER,
    "wrongAnswers" INTEGER,
    "percentage" DOUBLE PRECISION,
    "status" "AttemptStatus",
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AttemptQuestion" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "selectedOption" "CorrectOption",
    "isCorrect" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AttemptQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Guideline" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleUr" TEXT NOT NULL,
    "excerptEn" TEXT,
    "excerptUr" TEXT,
    "contentEn" TEXT NOT NULL,
    "contentUr" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAltEn" TEXT,
    "imageAltUr" TEXT,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Guideline_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AttemptQuestion_attemptId_questionId_key" ON "AttemptQuestion"("attemptId", "questionId");
CREATE INDEX "AttemptQuestion_attemptId_idx" ON "AttemptQuestion"("attemptId");
CREATE INDEX "AttemptQuestion_questionId_idx" ON "AttemptQuestion"("questionId");
CREATE INDEX "Question_isActive_idx" ON "Question"("isActive");
CREATE INDEX "Question_category_idx" ON "Question"("category");
CREATE INDEX "Attempt_phone_idx" ON "Attempt"("phone");
CREATE INDEX "Attempt_submittedAt_idx" ON "Attempt"("submittedAt");
CREATE UNIQUE INDEX "Guideline_slug_key" ON "Guideline"("slug");
CREATE INDEX "Guideline_isActive_idx" ON "Guideline"("isActive");
CREATE INDEX "Guideline_category_idx" ON "Guideline"("category");
CREATE INDEX "Guideline_sortOrder_idx" ON "Guideline"("sortOrder");

ALTER TABLE "AttemptQuestion" ADD CONSTRAINT "AttemptQuestion_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AttemptQuestion" ADD CONSTRAINT "AttemptQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
