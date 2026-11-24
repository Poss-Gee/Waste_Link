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
        navy: {
          DEFAULT: "#123B66",
          50: "#F5F8FC",
          100: "#DBEAFE",
          200: "#BFDBFE",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#123B66",
        },
        brand: {
          DEFAULT: "#2563EB",
          navy: "#123B66",
          light: "#DBEAFE",
          pale: "#F5F8FC",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F8FC",
          elevated: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#172B43",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          light: "#F1F5F9",
          strong: "#CBD5E1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(18, 59, 102, 0.05), 0 1px 2px -1px rgba(18, 59, 102, 0.05)",
        card: "0 4px 6px -1px rgba(18, 59, 102, 0.05), 0 2px 4px -2px rgba(18, 59, 102, 0.05)",
        floating: "0 10px 25px -5px rgba(18, 59, 102, 0.1), 0 8px 10px -6px rgba(18, 59, 102, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
