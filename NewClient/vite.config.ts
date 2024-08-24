import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';


// https://vitejs.dev/config/

var basePath = path.resolve(__dirname, "./src")
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": basePath,
    },
  },
  build: {
    rollupOptions: {
      input: {
        settings: "src/settings/index.html",
        popup: "src/popup/index.html",
        webtracker:"src/web-tracker/index.html",
        // compromise:"src/background/compromise.js",
        // eventPage:"src/background/eventPage.js",
        adblocker:"src/background/adblocker.js"

      },
      output: {
        entryFileNames: (chunkInfo) => {
          // console.log('ChunkInfo:', chunkInfo);
          if (chunkInfo.facadeModuleId.startsWith(path.resolve(basePath,'./content'))) {
            return 'scripts/content/[name].js';
          }
          if (chunkInfo.facadeModuleId.startsWith(path.resolve(basePath,'./background'))) {
            return 'scripts/background/[name].js';
          }
          return '[name].js';
        }
      },
    },
    target: 'esnext'
  },
});
