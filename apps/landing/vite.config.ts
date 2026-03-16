import { defineConfig } from "vite";
import contentCollections from "@content-collections/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  plugins: [
    contentCollections(),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
  ],
  resolve : {
    tsconfigPaths: true,
  }
});

export default config;
