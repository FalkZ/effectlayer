import type { ElementTag } from "./jsx-runtime";

const map = new Map<ElementTag, Set<string>>();

function getElementProps(
    obj: HTMLElement,
    element = obj,
    props: string[] = [],
) {
    if (!obj) return props;

    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(
        ([name, descriptor]) => {
            if (descriptor.writable || descriptor.set) props.push(name);
        },
    );

    return getElementProps(Object.getPrototypeOf(obj), element, props);
}

export const getPropsSet = (tag: ElementTag): Set<string> => {
    if (map.has(tag)) return map.get(tag)!;

    const el = document.createElement(tag);

    const props = new Set(getElementProps(el));
    map.set(tag, props);

    return props;
};
