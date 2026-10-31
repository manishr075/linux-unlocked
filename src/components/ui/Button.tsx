import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-cyan-400 to-cyan-500 text-ink-onAccent font-semibold shadow-[0_0_20px_rgba(34,211,238,0.2),inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-105 active:scale-[0.98] border border-cyan-300/30",
  secondary:
    "glass-card text-ink-primary hover:border-line-strong hover:bg-surface/80 active:scale-[0.98] shadow-sm",
  ghost:
    "bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-white/[0.05] active:scale-[0.98] border border-transparent",
  danger:
    "bg-error/15 text-error border border-error/30 hover:bg-error/25 active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md tracking-wide",
  md: "text-sm px-4 py-2 rounded-lg tracking-normal",
  lg: "text-base px-6 py-2.5 rounded-lg font-medium",
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
