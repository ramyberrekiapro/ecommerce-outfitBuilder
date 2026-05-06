import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F5F0EB",
        ink: "#1A1A1A",
        dune: "#C9B99A",
        sea: "#0D1B2A",
        terracotta: "#B5582F",
        mist: "#E8E2DA",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "wider-2": "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
