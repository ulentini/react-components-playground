defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  theme: {
    // Some useful comment
    spacing: {
      ...defaultTheme.spacing,
      "14": "3.5rem",
    },
  },
  variants: {
    // Some useful comment
  },
  plugins: [
    require("tailwindcss-transitions")({
      transitionPrefix: "tr",
      willChangePrefix: "tr-wc",
      properties: {
        "pt-fs-color": ["padding-top", "font-size", "color"],
      },
      durations: {
        "100": "100ms",
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
      },
      timingFunctions: {
        default: "linear",
        ease: "ease",
      },
      delays: {
        none: "0s",
      },
    }),
  ],
}
