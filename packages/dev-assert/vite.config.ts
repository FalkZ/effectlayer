import process from "node:process";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from 'vite-plugin-externalize-deps'


export default defineConfig({
  plugins: [
    dts(),
    externalizeDeps()
  ],
  define: {
    ASSERT: String(process.env.NODE_ENV !== "production"),
  },

  build: {
    lib: {
      entry: ["./src/dev-assert.ts", "./src/vite-plugin.ts"],
      fileName: (_format, entryAlias) => `${entryAlias}.js`,
      formats: ["es"],
    },
    sourcemap: true,
  },
});
