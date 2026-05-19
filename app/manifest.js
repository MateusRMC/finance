// app/manifest.js
export default function manifest() {
  return {
    name: "Aurora Finance",
    short_name: "Aurora Finance",
    description: "Simple Finance Tracker",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#000",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
