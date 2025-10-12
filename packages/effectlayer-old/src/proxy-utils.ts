export type ProxyDefinition = {
    get: (modifyMode: boolean) => any;
    set?: (value: any, modifyMode: boolean) => boolean;
};

export const createMapProxy = (
    target: object,
    map: Map<string | symbol, ProxyDefinition>,
    modifyMode = false,
) =>
    new Proxy(target, {
        get(target, prop, receiver) {
            const definition = map.get(prop);
            if (ASSERT) if (!definition) console.log(`Property ${String(prop)} not found in map`);

            if (definition) return definition.get(modifyMode);
            return Reflect.get(target, prop, receiver);
        },
        set(_target, prop, value) {
            const definition = map.get(prop);
            if (ASSERT) if (!definition) console.log(`Property ${String(prop)} not found in map`);

            if (definition?.set) return definition.set(value, modifyMode);
            return false;
        },
    });
