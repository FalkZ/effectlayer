/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: "all",
    tabWidth: 4,
    singleQuote: false,
    htmlWhitespaceSensitivity: "ignore",
    arrowParens: "always",
    plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-svelte"],
    overrides: [
        {
            files: "*.svelte",
            options: {
                parser: "svelte",
            },
        },
    ],
};

module.exports = config;
