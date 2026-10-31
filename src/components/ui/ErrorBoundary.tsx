import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Linux Unlocked Error Boundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore storage restrictions
    }
    window.location.href = "/";
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-base p-6 text-center text-ink-primary">
          <div className="mx-auto max-w-lg rounded-xl border border-red-500/30 bg-surface/90 p-8 shadow-2xl backdrop-blur-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <AlertTriangle size={32} />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink-primary">
              Linux Unlocked — Recovery Mode
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">
              An unexpected error occurred while rendering the interface.
            </p>

            {this.state.error && (
              <div className="my-4 max-h-36 overflow-auto rounded bg-void p-3 text-left font-mono text-xs text-red-300">
                {this.state.error.message}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw size={16} /> Reload Page
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleReset}
                className="gap-2 text-ink-muted hover:text-ink-primary"
              >
                <Trash2 size={16} /> Clear Cache & Reset
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
