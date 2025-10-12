import process from "node:process";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { replaceCodePlugin } from "vite-plugin-replace";

const isRegex = /!?\s*IS\s*(?:<\s*(\w+)\s*>)?\s*\(\s*(\w+)\s*\)/g;

export default defineConfig({
    plugins: [
        replaceCodePlugin({
            replacements: [
                {
                    from: isRegex,
                    to: "false",
                },
            ],
        }),
        analyzer(),
    ],
    define: {
        ASSERT: String(process.env.NODE_ENV !== "production"),
    },
    esbuild: {
        jsxInject: `import { jsx, Fragment } from 'effectlayer/jsx-runtime'`,
    },
    build: {
        minify: "esbuild", // default; enables DCE after replacement
        /*   target: 'esnext',  // produce modern code so less transpiling “drags in” polyfills
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      } */
    },
});
