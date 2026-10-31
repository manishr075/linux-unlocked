import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-cyan text-ink-onAccent hover:brightness-110 shadow-glow border border-transparent",
  secondary:
    "glass text-ink-primary hover:border-line-strong border border-line-subtle",
  ghost:
    "bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-surface border border-transparent",
  danger:
    "bg-error/15 text-error border border-error/30 hover:bg-error/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2 rounded-md",
  lg: "text-base px-6 py-3 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast ease-soft focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";
