import { type ReactNode, lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";
import { ComingSoon } from "@/pages/ComingSoon";

const DiscoverPage = lazy(() =>
  import("@/pages/DiscoverPage").then((m) => ({ default: m.DiscoverPage })),
);
const DesktopPage = lazy(() =>
  import("@/pages/DesktopPage").then((m) => ({ default: m.DesktopPage })),
);
const AtlasPage = lazy(() =>
  import("@/pages/AtlasPage").then((m) => ({ default: m.AtlasPage })),
);
const TerminalPage = lazy(() =>
  import("@/pages/TerminalPage").then((m) => ({ default: m.TerminalPage })),
);
const DistrosPage = lazy(() =>
  import("@/pages/DistrosPage").then((m) => ({ default: m.DistrosPage })),
);
const CompatibilityPage = lazy(() =>
  import("@/pages/CompatibilityPage").then((m) => ({
    default: m.CompatibilityPage,
  })),
);
const MigratePage = lazy(() =>
  import("@/pages/MigratePage").then((m) => ({ default: m.MigratePage })),
);
const AboutPage = lazy(() =>
  import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);

function withShell(children: ReactNode) {
  return <AppShell>{children}</AppShell>;
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
    </div>
  );
}

function SuspendedShell({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>{children}</Suspense>
    </AppShell>
  );
}

function RouterErrorFallback() {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-2xl font-bold text-ink-primary">Something went wrong</h2>
        <p className="mt-2 text-sm text-ink-secondary">The page could not be displayed properly.</p>
        <a
          href="/"
          className="mt-4 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-ink-onAccent hover:bg-cyan/90 transition-colors"
        >
          Return Home
        </a>
      </div>
    </AppShell>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: withShell(<HomePage />),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/discover",
    element: (
      <SuspendedShell>
        <DiscoverPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/desktop",
    element: (
      <SuspendedShell>
        <DesktopPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/atlas",
    element: (
      <SuspendedShell>
        <AtlasPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/terminal",
    element: (
      <SuspendedShell>
        <TerminalPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/distros",
    element: (
      <SuspendedShell>
        <DistrosPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/compatibility",
    element: (
      <SuspendedShell>
        <CompatibilityPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/migrate",
    element: (
      <SuspendedShell>
        <MigratePage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/about",
    element: (
      <SuspendedShell>
        <AboutPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/sources",
    element: (
      <SuspendedShell>
        <AboutPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "/contribute",
    element: (
      <SuspendedShell>
        <AboutPage />
      </SuspendedShell>
    ),
    errorElement: <RouterErrorFallback />,
  },
  {
    path: "*",
    element: withShell(
      <ComingSoon
        title="Page not found"
        description="That route doesn't exist yet. Explore the modules from the navigation above."
      />,
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
