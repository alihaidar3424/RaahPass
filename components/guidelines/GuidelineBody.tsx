"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type GuidelineBodyProps = {
  content: string;
};

type ParsedImage = {
  altEn: string;
  altUr: string;
  src: string;
};

function parseImage(line: string): ParsedImage | null {
  const match = line.match(/^!\[(.+?)\]\((.+?)\)$/);
  if (!match) return null;
  const altParts = match[1].split("|");
  return {
    altEn: altParts[0]?.trim() ?? "",
    altUr: altParts[1]?.trim() ?? altParts[0]?.trim() ?? "",
    src: match[2],
  };
}

function renderParagraph(text: string, key: string) {
  return (
    <p key={key} className="text-base leading-7 text-muted-foreground">
      {text}
    </p>
  );
}

function renderBlockquote(text: string, key: string) {
  return (
    <blockquote
      key={key}
      className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground"
    >
      {text.replace(/^>\s?/, "")}
    </blockquote>
  );
}

function renderList(items: string[], key: string) {
  return (
    <ul key={key} className="list-disc space-y-2 ps-5 text-base leading-7 text-muted-foreground">
      {items.map((item, index) => (
        <li key={index}>{item.replace(/^-\s+/, "")}</li>
      ))}
    </ul>
  );
}

function renderImage(image: ParsedImage, key: string) {
  return (
    <figure key={key} className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] w-full bg-muted/30">
        <Image
          src={image.src}
          alt={image.altEn}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, 640px"
        />
      </div>
    </figure>
  );
}

export function GuidelineBody({ content }: GuidelineBodyProps) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let listBuffer: string[] = [];
  let nodeIndex = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    nodes.push(renderList(listBuffer, `list-${nodeIndex++}`));
    listBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed);
      continue;
    }

    flushList();

    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${nodeIndex++}`} className="text-lg font-semibold text-foreground">
          {trimmed.replace(/^## /, "")}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${nodeIndex++}`} className="text-base font-semibold text-foreground">
          {trimmed.replace(/^### /, "")}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith("> ")) {
      nodes.push(renderBlockquote(trimmed, `quote-${nodeIndex++}`));
      continue;
    }

    const image = parseImage(trimmed);
    if (image) {
      nodes.push(renderImage(image, `img-${nodeIndex++}`));
      continue;
    }

    nodes.push(renderParagraph(trimmed, `p-${nodeIndex++}`));
  }

  flushList();

  return <div className="space-y-4">{nodes}</div>;
}
