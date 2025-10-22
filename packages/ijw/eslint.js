import js from "@eslint/js";
import { plugins } from "eslint-config-airbnb-extended";

import ts from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

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
        {
            rules: {
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
    ]);
};

export default createConfig;
