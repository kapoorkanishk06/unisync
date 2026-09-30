import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-text-dim border border-border",
        risk: "bg-surface-2 text-text border border-border",
        critical: "bg-risk-critical/10 text-risk-critical border border-risk-critical/20",
        high: "bg-risk-high/10 text-risk-high border border-risk-high/20",
        medium: "bg-risk-medium/10 text-risk-medium border border-risk-medium/20",
        low: "bg-risk-low/10 text-risk-low border border-risk-low/20",
        success: "bg-risk-low/10 text-risk-low border border-risk-low/20",
        brand: "bg-brand-1/10 text-brand-1 border border-brand-1/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
