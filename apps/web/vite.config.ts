import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  resolve: {
    // 🎯 CETTE LIGNE EST LA CLÉ : Elle force l'utilisation d'une seule copie de React
    dedupe: ["react", "react-dom"],
    alias: {
      // On s'assure que @monprojet/shared pointe bien vers le dossier packages
      "@monprojet/shared": path.resolve(__dirname, "../../packages/shared"),
    },
  },
});
