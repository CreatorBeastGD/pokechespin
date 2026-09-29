import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PokéChespin",
    short_name: "PokéChespin",
    description:
      "Calculate the damage output of your Pokémon in Pokémon GO! Simulate battles and raids, and find out the best moveset for your Pokémon.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "en",
    categories: ["games", "utilities"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Raids",
        short_name: "Raids",
        description: "Raid damage calculator and simulations",
        url: "/",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Max Battles",
        short_name: "Max Battles",
        description: "Max Battles damage calculator and simulations",
        url: "/dynamax",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Max Rankings by Types",
        short_name: "Max Rankings",
        description: "Best Max Battles attackers and tanks by type",
        url: "/dynamax/rankings/types",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Max General Rankings",
        short_name: "General Rankings",
        description: "Overall Max Battles attackers and tanks rankings",
        url: "/dynamax/rankings/general",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
