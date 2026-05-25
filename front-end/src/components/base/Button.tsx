import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "translucent"
  | "error"
  | "ghost"
  | "glass"
  | "outline";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-label-sm",
  md: "h-10 px-4 text-label-md",
  lg: "h-12 px-6 text-label-lg",
  xl: "h-14 px-8 text-title-md",
  icon: "w-10 h-10 p-0 flex items-center justify-center",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] rounded-full font-medium tracking-tight text-[14px]",
  secondary:
    "bg-surface-container-high text-on-surface hover:bg-surface-container-highest active:scale-[0.98] rounded-full font-medium tracking-tight text-[14px] border border-outline-variant/10",
  translucent:
    "bg-surface-container-highest/80 text-on-surface hover:bg-surface-container-highest active:scale-[0.98] rounded-[20px] px-3.5 py-2 font-medium tracking-tight text-[14px] border border-outline-variant/10",
  error:
    "bg-error text-on-error hover:bg-error/90 active:scale-[0.98] rounded-full font-medium tracking-tight text-[14px]",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface active:bg-surface-container-highest rounded-lg",
  glass:
    "bg-glass-bg backdrop-blur-md border border-glass-border text-on-surface hover:bg-surface-container-high/60 active:scale-[0.98] rounded-full shadow-glass shadow-sm",
  outline:
    "bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-low active:scale-[0.98] rounded-full",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size = "md",
      variant = "primary",
      isLoading = false,
      disabled,
      prefixIcon,
      suffixIcon,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base reset and flex centering
          "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 outline-none select-none",
          // Interaction disabled states
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none",
          // Focus rings for accessibility
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          sizeStyles[size],
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && prefixIcon && <span className="shrink-0 flex items-center justify-center">{prefixIcon}</span>}
        {children && <span className="truncate">{children}</span>}
        {!isLoading && suffixIcon && <span className="shrink-0 flex items-center justify-center">{suffixIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
