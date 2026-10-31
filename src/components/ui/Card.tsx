import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

/** Raised surface container. `glass` adds a frosted translucent effect. */
export function Card({
  children,
  className = "",
  glass = true,
  hover = true,
  onClick,
}: CardProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`rounded-xl p-5 text-left ${
        glass ? "glass-card" : "rounded-xl border border-line-subtle bg-surface/90"
      } ${hover ? "card-hover-fx" : ""} ${
        onClick ? "w-full cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
