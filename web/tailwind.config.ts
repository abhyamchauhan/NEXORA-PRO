import type { Config } from "tailwindcss";

// GENRAGE design tokens ported from the Claude Design mockup (_ds/tokens).
// Monochrome streetwear system — colour is functional only.
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        ink: "#1c1c1c",
        graphite: "#262626",
        concrete: "#c4c4c4",
        bone: "#e9e5dd",
        sale: "#c5312d",
        rating: "#47a730",
        grey: {
          50: "#f5f5f5",
          100: "#ededed",
          200: "#dddddd",
          300: "#c4c4c4",
          400: "#a7a7a7",
          500: "#6b6b6b",
          700: "#4a4a4a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Instrument Sans", "sans-serif"],
        body: ["var(--font-body)", "Nunito", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        button: "2px",
      },
      maxWidth: {
        container: "85rem", // 1360px
      },
      boxShadow: {
        drawer: "-8px 0 40px rgb(0 0 0 / 0.12)",
        card: "0 5px 30px rgb(0 0 0 / 0.05)",
      },
      letterSpacing: {
        display: "-0.01em",
        label: "0.12em",
        button: "0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
