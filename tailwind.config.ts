import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#102A43",
        ink: "#172B4D",
        muted: "#64748B",
        bridge: "#1E7A72",
        paper: "#F8FAFC"
      }
    }
  },
  plugins: []
}
export default config
