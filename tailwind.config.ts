import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── 莫蘭迪深色主題色板 ──
        oasis: {
          bg:       "#12161A",   // 主背景
          surface:  "#1A1F24",   // 卡片/面板
          surface2: "#22282E",   // 次級面板
          border:   "#2A3038",   // 邊框
          muted:    "#5E6A75",   // 次級文字
          text:     "#C8CDD0",   // 主文字（暖灰米白）
          warm:     "#D4C5B9",   // 暖米白強調
          sage:     "#9BAF9E",   // 鼠尾草綠
          sageDim:  "#6B7D6E",   // 深鼠尾草綠
          slate:    "#8A9BAE",   // 石板藍
          slateDim: "#5D6D7E",   // 深石板藍
          bloom:    "#B8A9C9",   // 淡紫（花）
          glow:     "#C9B99A",   // 暖金光（鵝卵石）
          sky:      "#7B93A8",   // 天空色
        },
      },
      fontFamily: {
        sans: [
          "Noto Sans TC",
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in":    "fadeIn 0.6s ease-out",
        "fade-up":    "fadeUp 0.8s ease-out",
        "float":      "float 6s ease-in-out infinite",
        "dissipate":  "dissipate 3s ease-out forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "bloom":      "bloom 1.5s ease-out",
        "glow":       "glow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        dissipate: {
          "0%":   { opacity: "1", transform: "translateY(0) scale(1)", filter: "blur(0px)" },
          "40%":  { opacity: "0.7", filter: "blur(1px)" },
          "80%":  { opacity: "0.15", filter: "blur(4px)" },
          "100%": { opacity: "0", transform: "translateY(-40px) scale(1.05)", filter: "blur(8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.7" },
        },
        bloom: {
          "0%":   { transform: "scale(0.3)", opacity: "0" },
          "60%":  { transform: "scale(1.08)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(201, 185, 154, 0.3)" },
          "50%":      { boxShadow: "0 0 20px rgba(201, 185, 154, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
