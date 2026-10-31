import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Card } from "@/components/ui/Card";
import { Home, Compass, BookOpen, Terminal, Monitor, ArrowRight, AlertOctagon } from "lucide-react";

export function NotFoundPage() {
  const quickLinks = [
    { to: "/", label: "Homepage & Boot", icon: Home, desc: "Interactive boot experience and system overview" },
    { to: "/discover", label: "Discover Linux", icon: Compass, desc: "Kernel, GNU, desktop environments, and filesystem" },
    { to: "/atlas", label: "Linux Atlas", icon: BookOpen, desc: "Searchable verified knowledge base and learning paths" },
    { to: "/terminal", label: "Terminal Playground", icon: Terminal, desc: "Safe in-browser sandboxed shell missions" },
    { to: "/desktop", label: "Desktop Simulator", icon: Monitor, desc: "Interactive Linux desktop environment" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 md:py-28">
      <div className="text-center">
        <Pill tone="error" className="mb-4">
          <AlertOctagon size={13} className="mr-1 inline-block" />
          Error 404 • ENOENT
        </Pill>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          Unknown System Call.
        </h1>
        <p className="mt-4 text-base text-ink-secondary md:text-lg max-w-xl mx-auto">
          The requested memory address or path does not map to any registered kernel module, userland interface, or verified documentation.
        </p>

        {/* Terminal snippet */}
        <div className="mt-8 mx-auto max-w-lg rounded-xl border border-white/10 bg-[#06080e] p-4 text-left font-mono text-xs text-ink-secondary shadow-2xl">
          <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-[10px] text-ink-muted">
            <span className="h-2 w-2 rounded-full bg-rose-500/80" />
            <span className="h-2 w-2 rounded-full bg-amber-500/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-ink-muted">dmesg --level=err</span>
          </div>
          <div className="pt-3 space-y-1">
            <p className="text-rose-400">[    1.404000] vfs: path_lookup failed: ENOENT (No such file or directory)</p>
            <p className="text-ink-muted">[    1.404012] route: requested page does not exist in AppRouter table</p>
            <p className="text-cyan">[    1.404028] kernel: returning to safe userland entry point...</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary">
              <Home size={16} />
              Return to System Root (/)
            </Button>
          </Link>
          <Link to="/atlas">
            <Button variant="secondary">
              <BookOpen size={16} />
              Search Linux Atlas
            </Button>
          </Link>
        </div>
      </div>

      {/* Suggested navigation */}
      <div className="mt-16 border-t border-white/10 pt-12">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted text-center mb-6">
          Available System Modules
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="group">
                <Card className="p-4 h-full transition-all group-hover:border-cyan/40">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-cyan/10 p-2 text-cyan group-hover:bg-cyan/20 transition-colors">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-semibold text-ink-primary group-hover:text-cyan transition-colors text-sm">
                        {item.label}
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
