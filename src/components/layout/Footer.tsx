import { NavLink } from "react-router-dom";

const footerSections = [
  {
    title: "Experience",
    links: [
      { to: "/", label: "Home" },
      { to: "/discover", label: "Discover Linux" },
      { to: "/desktop", label: "Desktop Sandbox" },
    ],
  },
  {
    title: "Learn",
    links: [
      { to: "/atlas", label: "Knowledge Atlas" },
      { to: "/terminal", label: "Terminal Playground" },
    ],
  },
  {
    title: "Choose",
    links: [
      { to: "/distros", label: "Distro Explorer" },
      { to: "/compatibility", label: "Compatibility" },
      { to: "/migrate", label: "Migration Planner" },
    ],
  },
  {
    title: "Community",
    links: [
      { to: "/about", label: "Mission & Charter" },
      { to: "/sources", label: "Upstream Sources" },
      { to: "/contribute", label: "Contribute" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line-subtle bg-void">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
              <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="6" fill="none" stroke="#22d3ee" strokeWidth="2" />
                <circle cx="16" cy="16" r="2.5" fill="#3b82f6" />
              </svg>
              <span className="text-ink-primary">LINUX</span>
              <span className="text-gradient">UNLOCKED</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-muted">
              The Gateway to Linux. Discover, experience, and understand Linux —
              no installation required.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className="text-sm text-ink-muted hover:text-ink-primary transition-colors"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-line-subtle pt-6 text-xs text-ink-muted">
          <p>
            LINUX UNLOCKED is an independent, open-source educational project.
            Content is sourced from official documentation and verified regularly.
            See sources and verification dates on each article.
          </p>
          <p className="mt-2">
            Built with React, Three.js, GSAP, and TypeScript. Free and open-source.
          </p>
        </div>
      </div>
    </footer>
  );
}
