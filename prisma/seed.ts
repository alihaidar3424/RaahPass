import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CorrectOption } from "../generated/prisma/client";
import { guidelines } from "../data/guidelines";
import { buildSeedExplanation } from "../lib/explanations";
import { prisma } from "../lib/prisma";

type RawQuestion = {
  id: number;
  type: string;
  category: string;
  correctAnswer: "A" | "B" | "C" | "D";
  english: {
    question: string;
    options: Record<string, string>;
  };
  urdu: {
    question: string;
    options: Record<string, string>;
  };
};

type Dataset = {
  questions: RawQuestion[];
};

function optionValue(
  options: Record<string, string>,
  key: "A" | "B" | "C" | "D",
): string {
  return options[key]?.trim() ?? "";
}

async function main() {
  const filePath = join(process.cwd(), "data", "text-questions-bilingual.json");
  const raw = readFileSync(filePath, "utf8");
  const dataset = JSON.parse(raw) as Dataset;

  await prisma.attemptQuestion.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.guideline.deleteMany();

  const rows = dataset.questions.map((item) => ({
    questionEn: item.english.question.trim(),
    questionUr: item.urdu.question.trim(),
    optionAEn: optionValue(item.english.options, "A"),
    optionAUr: optionValue(item.urdu.options, "A"),
    optionBEn: optionValue(item.english.options, "B"),
    optionBUr: optionValue(item.urdu.options, "B"),
    optionCEn: optionValue(item.english.options, "C"),
    optionCUr: optionValue(item.urdu.options, "C"),
    optionDEn: optionValue(item.english.options, "D"),
    optionDUr: optionValue(item.urdu.options, "D"),
    correctOption: item.correctAnswer as CorrectOption,
    explanationEn: buildSeedExplanation("en", item.correctAnswer, item.english.options),
    explanationUr: buildSeedExplanation("ur", item.correctAnswer, item.urdu.options),
    category: item.category,
    isActive: true,
  }));

  await prisma.question.createMany({ data: rows });

  await prisma.guideline.createMany({
    data: guidelines.map((item) => ({
      slug: item.slug,
      titleEn: item.titleEn,
      titleUr: item.titleUr,
      excerptEn: item.excerptEn,
      excerptUr: item.excerptUr,
      contentEn: item.contentEn,
      contentUr: item.contentUr,
      category: item.category,
      sortOrder: item.sortOrder,
      imageUrl: item.imageUrl ?? null,
      imageAltEn: item.imageAltEn ?? null,
      imageAltUr: item.imageAltUr ?? null,
      isActive: true,
    })),
  });

  console.log(`Seeded ${rows.length} questions and ${guidelines.length} guidelines.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
