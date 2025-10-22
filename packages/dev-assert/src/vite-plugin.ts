import strip from "@rollup/plugin-strip";
import { type PluginOption } from "vite";

export type DevAssertPluginOptions = {
    /**
     * If `true`, instructs the plugin to update source maps accordingly after removing configured targets from the bundle.
     */
    sourceMap?: boolean;
    /**
     * A pattern, or array of patterns, which specify the files in the build the plugin should operate on.
     */
    include?: ReadonlyArray<string | RegExp> | string | RegExp | null;
    /**
     * A pattern, or array of patterns, which specify the files in the build the plugin should ignore.
     */
    exclude?: ReadonlyArray<string | RegExp> | string | RegExp | null;
};

const plugin = (options: DevAssertPluginOptions = {}): PluginOption => {
    const stripPlugin = strip({
        functions: ["devAssert", "devAssertType"],
        include: options.include || "**/*.(mjs|cjs|js|ts|vue|tsx|jsx|svelte)",
        exclude: options.exclude,
        sourceMap: options.sourceMap,
    });

    return { ...stripPlugin, name: "dev-assert" };
};

export default plugin;
