import { JSX as ReactJSX } from "react";
import { jsx as jsxFunction } from "./jsx";

declare global {
    declare const ASSERT: boolean;
    /**
     * This is a TS compile time cast, this check will be removed when building
     * @param value to typecast
     * @returns true if value has type
     */
    declare const IS = <Value>(value: any): value is Value => true;
}
