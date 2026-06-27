type GuidelineBodyProps = {
  content: string;
};

export function GuidelineBody({ content }: GuidelineBodyProps) {
  const blocks = content.split("\n\n").filter(Boolean);

  return (
    <div className="prose prose-slate max-w-none space-y-4 text-base leading-7 text-slate-700">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="text-lg font-semibold text-slate-900">
              {block.replace(/^## /, "")}
            </h2>
          );
        }
        return (
          <p key={index} className="text-slate-700">
            {block}
          </p>
        );
      })}
    </div>
  );
}
