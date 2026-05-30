const { hairlineWidth } = require("nativewind/theme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "var(--wl-border)",
        input: "var(--wl-border)",
        ring: "hsl(var(--ring))",
        background: "var(--wl-bg)",
        foreground: "var(--wl-text)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        brand: {
          DEFAULT: "#9B7CFF",
          dark: "#8466F0",
          deeper: "#6B4FE0",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "var(--wl-surface-2)",
          foreground: "var(--wl-text)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--wl-surface-2)",
          foreground: "var(--wl-text-2)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "brand-accent": {
          DEFAULT: "#FF6B8A",
          dark: "#F2604F",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "var(--wl-surface-solid)",
          foreground: "var(--wl-text)",
        },
        card: {
          DEFAULT: "var(--wl-surface-solid)",
          foreground: "var(--wl-text)",
        },
        // Aurora design-system tokens (namespaced to avoid clashes)
        wl: {
          accent: "var(--wl-accent)",
          "accent-2": "var(--wl-accent-2)",
          "accent-soft": "var(--wl-accent-soft)",
          "accent-line": "var(--wl-accent-line)",
          surface: "var(--wl-surface)",
          "surface-2": "var(--wl-surface-2)",
          "surface-solid": "var(--wl-surface-solid)",
          border: "var(--wl-border)",
          "border-2": "var(--wl-border-2)",
          text: "var(--wl-text)",
          "text-2": "var(--wl-text-2)",
          "text-3": "var(--wl-text-3)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
}
