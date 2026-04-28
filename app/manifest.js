// app/manifest.js
export default function manifest() {
  return {
    name: "PWA Teste",
    short_name: "PWA",
    description: "Meu primeiro PWA com Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: "/globe.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/globe.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
