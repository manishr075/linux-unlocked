import { NavLink } from "react-router-dom";
import { ExternalLink, Sparkles } from "lucide-react";

const footerSections = [
  {
    title: "Experiences",
    links: [
      { to: "/", label: "Homepage & 3D Boot" },
      { to: "/discover", label: "OS Architecture Explorer" },
      { to: "/desktop", label: "Interactive Simulated Desktop" },
    ],
  },
  {
    title: "Knowledge & Labs",
    links: [
      { to: "/atlas", label: "Knowledge Atlas (22 Domains)" },
      { to: "/terminal", label: "POSIX Shell Playground" },
      { to: "/distros", label: "Distro Recommendation Quiz" },
    ],
  },
  {
    title: "Migration & Hardware",
    links: [
      { to: "/compatibility", label: "Hardware & App Compatibility" },
      { to: "/migrate", label: "Windows to Linux Migration" },
      { to: "/sources", label: "Upstream Specifications" },
    ],
  },
  {
    title: "Project & Governance",
    links: [
      { to: "/about", label: "Mission & Philosophy" },
      { to: "/contribute", label: "Contribution Guide" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-void">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info & Badges */}
          <div className="lg:col-span-1">
            <div className="mb-3.5 flex items-center gap-2.5 font-display text-sm font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10">
                <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
                  <circle cx="16" cy="16" r="6" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                  <circle cx="16" cy="16" r="2.5" fill="#38bdf8" />
                </svg>
              </div>
              <span className="text-ink-primary font-bold tracking-wider">LINUX</span>
              <span className="text-gradient font-bold tracking-wider">UNLOCKED</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-muted">
              The premier interactive gateway to Linux. Explore operating system architecture from silicon to software with zero installation.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Static Single-Page App
              </span>
            </div>
          </div>

          {/* Nav Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="text-xs text-ink-muted hover:text-cyan transition-colors"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Upstream Official Documentation References */}
        <div className="mt-12 rounded-xl border border-white/[0.06] bg-surface/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
            <span className="font-semibold text-ink-secondary flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan" /> Verified Upstream Sources:
            </span>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href="https://kernel.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors flex items-center gap-1"
              >
                Kernel.org <ExternalLink size={10} />
              </a>
              <a
                href="https://wiki.archlinux.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors flex items-center gap-1"
              >
                Arch Wiki <ExternalLink size={10} />
              </a>
              <a
                href="https://www.debian.org/doc/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors flex items-center gap-1"
              >
                Debian Docs <ExternalLink size={10} />
              </a>
              <a
                href="https://systemd.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors flex items-center gap-1"
              >
                systemd.io <ExternalLink size={10} />
              </a>
              <a
                href="https://wayland.freedesktop.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors flex items-center gap-1"
              >
                Wayland <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-xs text-ink-muted">
          <p>
            © {new Date().getFullYear()} LINUX UNLOCKED. An independent, free and open-source educational platform.
          </p>
          <div className="flex items-center gap-4">
            <NavLink to="/about" className="hover:text-ink-primary transition-colors">
              Philosophy & Charter
            </NavLink>
            <span>•</span>
            <NavLink to="/sources" className="hover:text-ink-primary transition-colors">
              Citations
            </NavLink>
            <span>•</span>
            <NavLink to="/contribute" className="hover:text-ink-primary transition-colors">
              Contribute
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
