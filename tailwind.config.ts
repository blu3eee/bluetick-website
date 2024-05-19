import type { Config } from "tailwindcss";

const { default: flattenColorPalette } =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("tailwindcss/lib/util/flattenColorPalette");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "#06d6a0",
          dark: "#05ab80",
          light: "#38deb3",
          foreground: {
            DEFAULT: "#000000",
            dark: "#ffffff",
          },
        },
        error: {
          DEFAULT: "#ef476f",
          dark: "#bf3959",
          light: "#f26c8c",
          foreground: {
            DEFAULT: "#ffffff",
            dark: "#ffffff",
            light: "#000000",
          },
        },
        warning: {
          DEFAULT: "#ffd166",
          dark: "#cca752",
          light: "#ffda85",
          foreground: {
            DEFAULT: "#000000",
            dark: "#ffffff",
            light: "#000000",
          },
        },
        info: {
          DEFAULT: "#118ab2",
          dark: "#0e6e8e",
          light: "#41a1c1",
          foreground: {
            DEFAULT: "#ffffff",
            dark: "#ffffff",
            light: "#000000",
          },
        },
        discord: {
          DEFAULT: "#38343c",
          gray: {
            DEFAULT: "#36393e",
            light: "#424549",
            dark: "#282b30",
          },
          blurple: {
            DEFAULT: "#7289da",
          },
          bg: {
            DEFAULT: "#1e2124",
          },
          black: {
            DEFAULT: "#1e2124",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: "aurora 60s linear infinite",
      },
      transparent: "transparent",
      current: "currentColor",
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config;

export default config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
// eslint-disable-next-line
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    // eslint-disable-next-line
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}
