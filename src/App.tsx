import { LevelProvider } from "@/state/LevelProvider";
import { TranslatorProvider } from "@/state/TranslatorProvider";
import { TranslatorPopover } from "@/components/translator/TranslatorPopover";
import { AppRouter } from "@/app/AppRouter";
import { useEffect } from "react";
import { useUIStore } from "@/state/useUIStore";

function ThemeSync() {
  const theme = useUIStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <LevelProvider>
      <TranslatorProvider>
        <ThemeSync />
        <AppRouter />
        <TranslatorPopover />
      </TranslatorProvider>
    </LevelProvider>
  );
}
