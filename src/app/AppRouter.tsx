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

const router = createBrowserRouter([
  {
    path: "/",
    element: withShell(<HomePage />),
  },
  {
    path: "/discover",
    element: (
      <SuspendedShell>
        <DiscoverPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/desktop",
    element: (
      <SuspendedShell>
        <DesktopPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/atlas",
    element: (
      <SuspendedShell>
        <AtlasPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/terminal",
    element: (
      <SuspendedShell>
        <TerminalPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/distros",
    element: (
      <SuspendedShell>
        <DistrosPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/compatibility",
    element: (
      <SuspendedShell>
        <CompatibilityPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/migrate",
    element: (
      <SuspendedShell>
        <MigratePage />
      </SuspendedShell>
    ),
  },
  {
    path: "/about",
    element: (
      <SuspendedShell>
        <AboutPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/sources",
    element: (
      <SuspendedShell>
        <AboutPage />
      </SuspendedShell>
    ),
  },
  {
    path: "/contribute",
    element: (
      <SuspendedShell>
        <AboutPage />
      </SuspendedShell>
    ),
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
