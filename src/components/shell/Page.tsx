import { cn } from "../../lib/utils";

interface PageProps {
  children: React.ReactNode;
  className?: string;
  width?: "wide" | "default" | "narrow";
}

export function Page({ children, className, width = "wide" }: PageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 py-5 md:py-6",
        width === "wide" && "max-w-7xl",
        width === "default" && "max-w-3xl",
        width === "narrow" && "max-w-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
