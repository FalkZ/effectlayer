import type { ComponentProps, JSX as ReactJSX } from "react";
import {
    Fragment,
    type JsxVNodeChildren,
    jsx as jsxOriginal,
    type VNode,
    type VNodeData,
} from "snabbdom";
import { getPropsSet } from "./props-set";
import { devAssertType } from "dev-assert";

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

const listenerRegex = /^on[A-Z]/;

type Data = Required<Pick<VNodeData, "on" | "props" | "attrs">>;

const addListener = (data: Data, listenerName: string, callback: any) => {
    const currentListener = data.on[listenerName];
    if (currentListener) {
        devAssertType(
            currentListener,
            (listener): listener is any[] => Array.isArray(listener),
            "attached listeners were not arrays",
        );
        currentListener.push(callback);
    } else {
        data.on[listenerName] = [callback];
    }
};

export const jsx = <T extends Tag>(
    tag: T,
    props: GetProps<T> & {
        children?: JsxVNodeChildren[];
    },
): VNode => {
    if (typeof tag === "string") {
        if (!props) return jsxOriginal(tag, {});

        const propKeys = Object.keys(props);

        const data: Data = {
            on: {},
            props: {},
            attrs: {},
        };

        const propsSet = getPropsSet(tag);

        for (const propKey of propKeys) {
            if (propKey === "children") {
                // biome-ignore lint: continue for performance?
                continue;
            } else if (propKey.startsWith("onValue")) {
                // TODO: value update
                const listenerName = propKey.slice(7).toLowerCase();
                addListener(
                    data,
                    listenerName,
                    ({
                        currentTarget,
                    }: {
                        currentTarget: HTMLInputElement;
                    }) => {
                        (props as any)[propKey];
                    },
                );
            } else if (listenerRegex.test(propKey)) {
                const listenerName = propKey.slice(2).toLowerCase();
                addListener(data, listenerName, (props as any)[propKey]);
            } else if (propsSet.has(propKey)) {
                console.log(propKey);
                data.props[propKey] = (props as any)[propKey];
            } else {
                data.attrs[propKey] = (props as any)[propKey];
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
        input:
            | {
                  type: "number";
                  onValueChange?:
                      | ((value: number | null) => void)
                      | ((value: number | null) => number | null);
                  onValueInput?:
                      | ((value: number | null) => void)
                      | ((value: number | null) => number | null);
              }
            | {
                  type: "text";
                  onValueChange?:
                      | ((value: string) => void)
                      | ((value: string) => string);
                  onValueInput?:
                      | ((value: string) => void)
                      | ((value: string) => string);
              }
            | { type: string };
    };
}
