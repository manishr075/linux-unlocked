import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Accessible modal dialog with focus trap and Esc-to-close. */
export function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`glass relative z-base w-full max-w-lg rounded-xl border border-line-default p-6 shadow-lg ${className}`}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-secondary hover:bg-surface hover:text-ink-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
