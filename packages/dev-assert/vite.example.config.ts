
import { defineConfig } from "vite";
import devAssertPlugin from "./src/vite-plugin";

export default defineConfig({
  build: {
    outDir: './example'
  },
  plugins: [
    devAssertPlugin(),
  ],
});
