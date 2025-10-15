import { h, type VNode, type VNodeData } from "snabbdom";
import hyperx from "hyperx";

import booleanProps from "../patched/boolean-props.json";
import { isEventName } from "./all-listnerers";

const booleanSet = new Set(booleanProps);

const isBoolAttribute = (name: string) => booleanSet.has(name);

type TaggedTemplate = (
    strings: TemplateStringsArray,
    ...values: any[]
) => VNode;

function createElement(
    selector: string,
    props: Record<string, any>,
    children?: any | any[],
) {
    if (selector === "!--") return h("!", props.comment);

    if (children?.length) {
        if (children.length === 1) children = children[0];
        else children = children.flat();
    }

    const propKeys = Object.keys(props);
    if (propKeys.length === 0) return h(selector, children);

    const data: VNodeData = {};
    for (const propKey of propKeys) {
        if (propKey === "key") {
            data.key = props[propKey];
        } else if (isEventName(propKey)) {
            if (!data.on) data.on = {};
            data.on[propKey.slice(2)] = props[propKey];
        } else if (propKey.startsWith("@")) {
            if (!data.props) data.props = {};

            const key = propKey.slice(1);

            // hyperx converts booleans to string that's why we need this
            if (isBoolAttribute(key))
                data.props[key] = props[propKey] !== "false";
            else data.props[key] = props[propKey];
        } else if (
            (propKey === "class" || propKey === "style") &&
            typeof props[propKey] === "object"
        ) {
            data[propKey] = props[propKey];
        } else {
            if (!data.attrs) data.attrs = {};

            // hyperx converts booleans to string that's why we need this
            if (isBoolAttribute(propKey))
                data.attrs[propKey] = props[propKey] !== "false";
            else data.attrs[propKey] = props[propKey];
        }
    }
    return h(selector, data, children);
}

export const html = hyperx(createElement, {
    comments: true,
    attrToProp: false,
}) as TaggedTemplate;
