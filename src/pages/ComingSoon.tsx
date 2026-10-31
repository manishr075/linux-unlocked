import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  phase?: string;
  children?: ReactNode;
}

/** Placeholder for routes not yet built. Shows phase context and a home link. */
export function ComingSoon({ title, description, phase, children }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <div className="flex flex-col items-center text-center">
        <Construction className="mb-6 text-cyan" size={48} />
        {phase && <Pill tone="violet" className="mb-4">{phase}</Pill>}
        <h1 className="mb-4 text-3xl font-semibold">{title}</h1>
        <p className="mb-8 max-w-xl text-ink-secondary">{description}</p>
        {children}
        <Link to="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
