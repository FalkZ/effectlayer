import type { ComponentProps, JSX as ReactJSX } from "react";
import {
    Fragment,
    type JsxVNodeChildren,
    jsx as jsxOriginal,
    type VNode,
    type VNodeData,
} from "snabbdom";
import { getPropsSet } from "./props-set";
import { devAssert } from "dev-assert";

type SnabbdomProps = {
    [prop: string]: any;
} | null;

export type FunctionComponent<Props extends SnabbdomProps = SnabbdomProps> = (
    props: Props,
    children?: VNode[],
) => VNode;

export type ElementTag = keyof JSX.IntrinsicElements;

type Tag = keyof JSX.IntrinsicElements | FunctionComponent;

type GetProps<T extends Tag> = T extends FunctionComponent<infer Props>
    ? Props
    : T extends keyof JSX.IntrinsicElements
      ? ComponentProps<T>
      : never;

const isElement = (tag: Tag): tag is keyof JSX.IntrinsicElements =>
    typeof tag === "string";

type AnyElementProps = ComponentProps<keyof JSX.IntrinsicElements>;

const listenerRegex = /^on[A-Z]/;

const isListenerKey = (propKey: string): boolean => listenerRegex.test(propKey);

export const jsx = <T extends Tag>(
    tag: T,
    props: GetProps<T> & {
        children?: JsxVNodeChildren[];
    },
): VNode => {
    if (typeof tag === "string") {
        if (!IS<AnyElementProps>(props)) throw Error("Invalid element props");

        if (!props) return jsxOriginal(tag, {});

        const propKeys = Object.keys(props);

        const data: VNodeData = { on: {}, props: {}, attrs: {} };

        const propsSet = getPropsSet(tag);

        for (const propKey of propKeys) {
            if (propKey === "children") continue;
            else if (isListenerKey(propKey)) {
                data.on[propKey.slice(2).toLowerCase()] = props[propKey];
            } else if (propsSet.has(propKey)) {
                console.log(propKey);
                data.props[propKey] = props[propKey];
            } else {
                data.attrs[propKey] = props[propKey];
            }
        }

        return jsxOriginal(tag, data, ...(props?.children ?? []));
    } else
        return jsxOriginal(
            tag,
            props as SnabbdomProps,
            ...(props?.children ?? []),
        );
};

export { Fragment, jsx as jsxDEV };

export namespace JSX {
    export type IntrinsicElements = ReactJSX.IntrinsicElements & {
        main: { test: "hello" };
        input:
            | { type: "number"; test: "hello" }
            | { type: "text"; test: "text" }
            | { type: string };
    };
}
