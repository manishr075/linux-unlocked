/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surface ramp
        void: "var(--c-bg-void)",
        base: "var(--c-bg-base)",
        surface: "var(--c-bg-surface)",
        elevated: "var(--c-bg-elevated)",
        // Accents
        cyan: { DEFAULT: "var(--c-accent-cyan)" },
        electric: { DEFAULT: "var(--c-accent-blue)" },
        violet: { DEFAULT: "var(--c-accent-violet)" },
        success: { DEFAULT: "var(--c-accent-success)" },
        warning: { DEFAULT: "var(--c-accent-warning)" },
        error: { DEFAULT: "var(--c-accent-error)" },
        // Text
        ink: {
          primary: "var(--c-text-primary)",
          secondary: "var(--c-text-secondary)",
          muted: "var(--c-text-muted)",
          onAccent: "var(--c-text-on-accent)",
        },
        // Borders
        line: {
          subtle: "var(--c-border-subtle)",
          DEFAULT: "var(--c-border-default)",
          strong: "var(--c-border-strong)",
          accent: "var(--c-border-accent)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        xs: "var(--fs-xs)",
        sm: "var(--fs-sm)",
        base: "var(--fs-base)",
        lg: "var(--fs-lg)",
        xl: "var(--fs-xl)",
        "2xl": "var(--fs-2xl)",
        "3xl": "var(--fs-3xl)",
        "4xl": "var(--fs-4xl)",
        "5xl": "var(--fs-5xl)",
      },
      lineHeight: {
        tight: "var(--lh-tight)",
        snug: "var(--lh-snug)",
        normal: "var(--lh-normal)",
        relaxed: "var(--lh-relaxed)",
      },
      spacing: {
        1: "var(--sp-1)",
        2: "var(--sp-2)",
        3: "var(--sp-3)",
        4: "var(--sp-4)",
        5: "var(--sp-5)",
        6: "var(--sp-6)",
        7: "var(--sp-7)",
        8: "var(--sp-8)",
        9: "var(--sp-9)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        soft: "var(--ease-out-soft)",
        "in-out-soft": "var(--ease-in-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        normal: "var(--dur-normal)",
        slow: "var(--dur-slow)",
      },
      zIndex: {
        base: "var(--z-base)",
        sticky: "var(--z-sticky)",
        nav: "var(--z-nav)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        tooltip: "var(--z-tooltip)",
      },
      backdropBlur: {
        glass: "var(--glass-blur)",
      },
    },
  },
  plugins: [],
};
