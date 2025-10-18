const map = new Map<string, Set<string>>();

const prototypeCache = new Map<object, string[]>();

const getPrototypeProps = (prototype: object): string[] => {
    if (prototypeCache.has(prototype)) return prototypeCache.get(prototype)!;

    const currentProtoProps: string[] = [];

    Object.entries(Object.getOwnPropertyDescriptors(prototype)).forEach(
        ([name, descriptor]) => {
            if (name.startsWith("__")) return;

            if (descriptor.set) currentProtoProps.push(name);
            else if (
                "value" in descriptor &&
                descriptor.writable &&
                typeof descriptor.value !== "function"
            )
                currentProtoProps.push(name);
        },
    );

    const parentPrototype = Object.getPrototypeOf(prototype);
    if (parentPrototype) {
        currentProtoProps.push(...getPrototypeProps(parentPrototype));
    }

    prototypeCache.set(prototype, currentProtoProps);

    return currentProtoProps;
};

export const getPropsSet = (tag: string): Set<string> => {
    if (map.has(tag)) return map.get(tag)!;

    const obj = Object.getPrototypeOf(document.createElement(tag));

    const props = new Set(getPrototypeProps(obj));
    map.set(tag, props);

    return props;
};
