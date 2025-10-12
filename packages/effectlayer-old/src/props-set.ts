import type { ElementTag } from "./jsx";

const map = new Map<ElementTag, Set<string>>();

function getElementProps(
    obj: HTMLElement,
    element = obj,
    props = { methods: [], properties: [], events: [] },
) {
    if (!obj) return props;

    Object.getOwnPropertyNames(obj).forEach((prop) => {
        try {
            if (typeof element[prop] === "function") {
                props.methods.push(prop);
            } else if (prop.startsWith("on")) {
                props.events.push(prop);
            } else {
                props.properties.push(prop);
            }
        } catch (e) {}
    });

    return getElementProps(Object.getPrototypeOf(obj), element, props);
}

export const getPropsSet = (tag: ElementTag): Set<string> => {
    if (map.has(tag)) return map.get(tag)!;

    const el = document.createElement(tag);
    const a = getElementProps(el);

    const props = new Set(a.properties);
    map.set(tag, props);

    return props;
};

console.log(getPropsSet("input"));
