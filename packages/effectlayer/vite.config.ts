import process from "node:process";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import { replaceCodePlugin } from "vite-plugin-replace";
import dts from "vite-plugin-dts";

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
        dts(),
        analyzer({ openAnalyzer: false }),
    ],
    define: {
        ASSERT: String(process.env.NODE_ENV !== "production"),
    },

    build: {
        lib: {
            entry: ["./src/effectlayer.ts", "./src/jsx-runtime.ts"],
            fileName: (_format, entryAlias) => `${entryAlias}.js`,
            formats: ["es"],
        },
        sourcemap: true,
    },
});
