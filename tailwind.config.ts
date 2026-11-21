import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "2rem", xl: "3rem" }, screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        forest: "#9E1B1F",
        emerald: { DEFAULT: "#D7262E", 50: "#FDECEC" },
        cream: "#F7F2E8",
        ivory: "#FFFDF8",
        gold: { DEFAULT: "#E8B21E", light: "#F7D774" },
        brown: "#806347",
        ink: "#1E2A24",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(158,27,31,.04), 0 8px 24px -8px rgba(158,27,31,.12)",
        lift: "0 2px 4px rgba(158,27,31,.05), 0 24px 48px -16px rgba(158,27,31,.22)",
      },
      letterSpacing: { widest2: ".28em" },
    },
  },
  plugins: [],
} satisfies Config;
