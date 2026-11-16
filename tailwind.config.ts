import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#14532D",
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532D",
          950: "#052e16",
        },
        eco: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
          dark: "#14532D",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F9F5",
          elevated: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#17231B",
          muted: "#647067",
          subtle: "#94A399",
        },
        border: {
          DEFAULT: "#E5EAE4",
          light: "#F0F4EF",
          strong: "#CBD5CD",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(20, 83, 45, 0.05), 0 1px 2px -1px rgba(20, 83, 45, 0.05)",
        card: "0 4px 6px -1px rgba(20, 83, 45, 0.05), 0 2px 4px -2px rgba(20, 83, 45, 0.05)",
        floating: "0 10px 25px -5px rgba(20, 83, 45, 0.1), 0 8px 10px -6px rgba(20, 83, 45, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;

