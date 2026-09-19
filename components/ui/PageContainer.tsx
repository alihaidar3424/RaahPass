import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Extra bottom padding when bottom nav is visible (mobile only) */
  withBottomNav?: boolean;
  /** Layout width: shell (forms/quiz), content (default), wide (home/gallery) */
  width?: "shell" | "content" | "wide";
};

const widthClass = {
  shell: "max-w-lg md:max-w-xl",
  content: "max-w-lg md:max-w-3xl",
  wide: "max-w-lg md:max-w-5xl lg:max-w-6xl",
} as const;

export function PageContainer({
  children,
  className,
  withBottomNav,
  width = "content",
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8",
        widthClass[width],
        withBottomNav ? "pb-28 md:pb-12" : "pb-10 md:pb-14",
        "pt-[max(1.5rem,env(safe-area-inset-top))]",
        className,
      )}
    >
      {children}
    </main>
  );
}
