import { type ReactNode } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";

/** Page shell with skip link, navigation, content area, and footer. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-base text-ink-primary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-modal focus:rounded-md focus:bg-cyan focus:px-4 focus:py-2 focus:text-ink-onAccent"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
