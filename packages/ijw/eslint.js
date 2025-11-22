import js from "@eslint/js";
import { plugins } from "eslint-config-airbnb-extended";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, globalIgnores } from "eslint/config";
import ts from "typescript-eslint";

const svelteConfigPath = path.join(process.cwd(), "svelte.config.js");

let svelteConfig;

if (fs.existsSync(svelteConfigPath)) {
    svelteConfig = JSON.parse(fs.readFileSync(svelteConfigPath));
}

const createConfig = (options = {}) => {
    const defaultOptions = {
        accessibility: false,
        explicitFunctionReturnType: false,
        ...options,
    };

    return defineConfig([
        globalIgnores(["dist", "build", "node_modules"]),
        // javascript
        js.configs.recommended,
        // typescript
        ts.configs.recommendedTypeChecked,
        // svelte
        ...svelte.configs.recommended,
        // typescript & javascript
        {
            rules: {
                "no-undef": "off",
                "@typescript-eslint/require-await": "error",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-unsafe-return": "off",
                "@typescript-eslint/explicit-function-return-type":
                    defaultOptions.explicitFunctionReturnType ? "error" : "off",
            },
            languageOptions: {
                parserOptions: {
                    projectService: true,
                },
            },
        },
        // react
        plugins.react,
        plugins.reactHooks,
        defaultOptions.accessibility ? plugins.reactA11y : [],
        {
            rules: {
                "react/jsx-key": "error",
            },
        },
        // svelte
        {
            files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
            languageOptions: {
                parserOptions: {
                    projectService: true,
                    extraFileExtensions: [".svelte"],
                    parser: ts.parser,
                    svelteConfig,
                },
            },
        },
        {
            rules: {
                "svelte/no-at-html-tags": "off",
                "svelte/prefer-svelte-reactivity": "off",
            },
        },
    ]);
};

export default createConfig;
