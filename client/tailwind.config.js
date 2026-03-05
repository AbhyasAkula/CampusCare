//tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
 theme: {
  extend: {
    colors: {
      primary: "#5D87FF",
      primaryDark: "#4570EA",
      background: "#F5F7FB",
      card: "#FFFFFF",
      textMain: "#2A3547",
      textLight: "#7C8FAC",

      success: "#13DEB9",
      warning: "#FFAE1F",
      error: "#FA896B",
      info: "#49BEFF",
    },
  },
},
}
