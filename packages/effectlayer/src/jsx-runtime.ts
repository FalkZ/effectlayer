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
import type { CheckedValue, NumberValue } from "./types";

type SnabbdomProps = {
    [prop: string]: any;
} | null;

export type FunctionComponent<Props extends SnabbdomProps = SnabbdomProps> = (
    props: Props,
    children?: VNode[],
) => VNode;

export type ElementTag = keyof JSX.IntrinsicElements;

type Tag = keyof JSX.IntrinsicElements | FunctionComponent;

type GetProps<T extends Tag> =
    T extends FunctionComponent<infer Props>
        ? Props & { key?: string | number }
        : T extends keyof JSX.IntrinsicElements
          ? ComponentProps<T>
          : never;

const listenerRegex = /^on[A-Z]/;

type Data = Required<Pick<VNodeData, "on" | "props" | "attrs">> & {
    key?: string | number;
};

const addListener = (data: Data, listenerName: string, callback: any) => {
    const currentListener = data.on[listenerName];
    if (currentListener) {
        devAssert(
            !Array.isArray(currentListener),
            "unreachable: listener is already an array",
        );

        data.on[listenerName] = [currentListener, callback];
    } else {
        data.on[listenerName] = callback;
    }
};

const coerceInputValue = (type: string, currentTarget: HTMLInputElement) => {
    if (type === "checkbox") {
        if (currentTarget.indeterminate) return "indeterminate";

        return currentTarget.checked;
    } else if (type === "number") {
        if (currentTarget.value === "") return null;

        return currentTarget.valueAsNumber;
    }

    return currentTarget.value;
};

const setInputValue = (
    type: string,
    currentTarget: HTMLInputElement,
    value: any,
) => {
    if (type === "checkbox") {
        if (value === "indeterminate") {
            currentTarget.indeterminate = true;
            return;
        } else {
            currentTarget.checked = value;
            currentTarget.indeterminate = false;
            return;
        }
    } else if (type === "number") {
        if (value === null) {
            currentTarget.value = "";
            return;
        }

        currentTarget.value = value;
        return;
    }

    currentTarget.value = value;
};

export const jsx = <T extends Tag>(
    tag: T,
    props: GetProps<T> & {
        children?: JsxVNodeChildren[];
    },
    key?: string | number,
): VNode => {
    let children: JsxVNodeChildren[] = [];
    if (props?.children) {
        if (Array.isArray(props.children)) {
            children = props.children;
        } else {
            children = [props.children];
        }
    }

    if (typeof tag === "string") {
        if (!props) return jsxOriginal(tag, { key });

        const propKeys = Object.keys(props);

        const data: Data = {
            key,
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
                const listenerName = propKey.slice(7).toLowerCase();

                const callback = (props as any)[propKey];
                addListener(
                    data,
                    listenerName,
                    (
                        event: InputEvent & {
                            currentTarget: HTMLInputElement;
                        },
                    ) => {
                        const currentValue = coerceInputValue(
                            (props as any).type,
                            event.currentTarget,
                        );

                        const returnValue = callback(currentValue);
                        if (returnValue === undefined) return;

                        // fully control input behaviour
                        event.preventDefault();

                        setInputValue(
                            (props as any).type,
                            event.currentTarget,
                            returnValue,
                        );
                    },
                );
            } else if (listenerRegex.test(propKey)) {
                const listenerName = propKey.slice(2).toLowerCase();
                addListener(data, listenerName, (props as any)[propKey]);
            } else if (propsSet.has(propKey)) {
                data.props[propKey] = (props as any)[propKey];
            } else {
                data.attrs[propKey] = (props as any)[propKey];
            }
        }

        // console.log({ tag, data, children });
        return jsxOriginal(tag, data, ...children);
    } else {
        const component = jsxOriginal(
            tag,
            { ...props, key } as SnabbdomProps,
            ...children,
        );

        component.key = key ?? component.key;

        // console.log({ component });
        return component;
    }
};

export { Fragment, jsx as jsxDEV };

export namespace JSX {
    export type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
    export type IntrinsicElements = ReactJSX.IntrinsicElements & {
        input:
            | {
                  type: "number";
                  onValueChange?:
                      | ((value: NumberValue) => void)
                      | ((value: NumberValue) => NumberValue);
                  onValueInput?:
                      | ((value: NumberValue) => void)
                      | ((value: NumberValue) => NumberValue);
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
            | {
                  type: "checkbox";
                  onValueChange?:
                      | ((value: CheckedValue) => void)
                      | ((value: CheckedValue) => CheckedValue);
              }
            | { type: string };
    };
}
