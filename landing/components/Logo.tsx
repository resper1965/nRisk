import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-montserrat font-medium tracking-tight", className)}>
      n<span className="text-accent">.</span>Risk
    </span>
  );
}
