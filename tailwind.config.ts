import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      black: "hsl(237, 100%, 4%)",
      veryDarkGreyDarkBg: "hsl(235, 16%, 15%)",
      darkGrey: "hsl(235, 12%, 19%)",
      linesDark: "hsl(235, 12%, 27%)",
      mediumGrey: "hsl(216, 15%, 57%)",
      linesLight: "hsl(221, 69%, 94%)",
      lightGreyLightBg: "hsl(220, 69%, 97%)",
      white: "hsl(0, 0%, 100%)",
      mainPurple: "hsl(242, 48%, 58%)",
      mainPurpleHover: "hsl(242, 100%, 82%)",
      red: "hsl(0, 78%, 63%)",
      redHover: "hsl(0, 100%, 80%)",
    },
    fontFamily: {
      "jakarta-sans": ['"Plus Jakarta Sans"', "sans-serif"],
    },
    fontSize: {
      "heading-xl": [
        "24px",
        {
          lineHeight: "30px",
          fontWeight: "bold",
        },
      ],
      "heading-l": [
        "18px",
        {
          lineHeight: "23px",
          fontWeight: "bold",
        },
      ],
      "heading-m": [
        "15px",
        {
          lineHeight: "19px",
          fontWeight: "bold",
        },
      ],
      "heading-s": [
        "12px",
        {
          lineHeight: "15px",
          fontWeight: "bold",
          letterSpacing: "2.4px",
        },
      ],
      "body-l": [
        "13px",
        {
          lineHeight: "23px",
          fontWeight: "medium",
        },
      ],
      "body-m": [
        "12px",
        {
          lineHeight: "15px",
          fontWeight: "bold",
        },
      ],
    },
    extend: {
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-2px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionProperty: {
        height: "height",
      },
      boxShadow: {
        "task-card": "0 4px 6px 0 rgba(54, 78, 126, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
