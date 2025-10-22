import type { Config } from "eslint/config";

export type IjwOptions = {
    /**
     * Enables accessibility rules
     */
    accessibility: boolean;
    /**
     * Enforces to always define a return type. Recommended when ts performance is an issue.
     */
    explicitFunctionReturnType: boolean;
};

declare function createConfig(options?: Partial<IjwOptions>): Config;

export default createConfig;
