import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-medium ring-offset-surface-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:shadow-[0_0_12px_rgba(109,59,215,0.3)] hover:border-primary/30 cursor-pointer border border-transparent",
  {
    variants: {
      variant: {
        default: "bg-surface-highest text-on-surface hover:bg-surface-high",
        primary: "bg-primary text-on-primary hover:bg-primary-container",
        gradient: "btn-gradient",
        glass: "bg-surface-high/40 text-on-surface backdrop-blur-md border border-white/[0.08] hover:bg-surface-highest/60 hover:border-white/[0.15]",
        ghost: "text-on-surface-muted hover:text-on-surface hover:bg-surface-high/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        md: "h-11 px-6",
        lg: "h-12 rounded-[14px] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
