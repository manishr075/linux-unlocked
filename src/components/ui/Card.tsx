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
  glass = false,
  hover = false,
  onClick,
}: CardProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`rounded-lg border border-line-subtle p-5 text-left ${
        glass ? "glass" : "bg-surface"
      } ${hover ? "transition-all duration-normal ease-soft hover:border-line-strong hover:shadow-md" : ""} ${
        onClick ? "w-full cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
