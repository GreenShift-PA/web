/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primaire: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        primary: {
          25: "#0F7E78",
          50: "#11342E",
          100: "#213b37",
          200: "#195148",
          250: "#34534E",
          300: "#1D5F55",
          400: "#217E62",
          500: "#259D6F",
          600: "#29BB7C",
          700: "#2DDA89",
          800: "#31F895",
          900: "#35FFA2",
        },
        secondary: {
          50: "#F7F2DF",
          100: "#F1EBCE",
          200: "#ECE5CB",
          300: "#EBE4BD",
          400: "#DFD69B",
          500: "#D9CF8A",
          600: "#D3C979",
          700: "#CDC268",
          800: "#C7BB57",
          900: "#C1B446",
          950: "#172554",
        },
      },
      fontFamily: {
        body: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
    plugins: [],
  },
};
