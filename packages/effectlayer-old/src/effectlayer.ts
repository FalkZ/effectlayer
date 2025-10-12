import type { VNode } from "snabbdom";
import type { Constructor, Simplify } from "type-fest";
import { html, patch } from "./dom";
import { jsx } from "./jsx";
import { computed, effect } from "./patched/signals-core";
import { createMapProxy, type ProxyDefinition } from "./proxy-utils";
import { StateManagement } from "./state-management";

type AnyFunction = (...args: any[]) => any;

type EffectKey<Key> = Key extends `$${string}` ? Key : never;

type Effects<T extends object> = {
    [Key in EffectKey<keyof T>]: T[Key] extends () => VNode ? () => HTMLElement : T[Key];
};

type MethodsKeys<T extends object, Key extends keyof T> = Key extends `$${string}`
    ? never
    : T[Key] extends AnyFunction
      ? Key
      : never;

type Methods<T extends object> = {
    [Key in MethodsKeys<T, keyof T>]: T[Key];
};

export type Effectlayer<T extends object> = Simplify<Methods<T> & Effects<T>>;

export const effectlayer = <T extends object>(Class: Constructor<T>): Effectlayer<T> => {
    const instance = new Class();
    const instanceDescriptors = Object.getOwnPropertyDescriptors(instance);
    const prototypeDescriptors = Object.getOwnPropertyDescriptors(Class.prototype);

    const descriptors = [
        ...Object.entries(instanceDescriptors),
        ...Object.entries(prototypeDescriptors),
    ];

    const stateManagement = new StateManagement();

    const proxyMap = new Map<string | symbol, ProxyDefinition>();

    let readProxy = createMapProxy(instance, proxyMap);
    let modifyProxy = createMapProxy(instance, proxyMap, true);

    if (ASSERT) console.log({ descriptors });

    descriptors.forEach(([key, descriptor]) => {
        if (key.startsWith("$")) {
            proxyMap.set(key, {
                get() {
                    const fn = descriptor.value;

                    if (typeof fn !== "function") {
                        console.error(`Fields starting with $ must be methods`);

                        return;
                    }

                    // TODO: figure out what to do with args
                    // TODO: return observables
                    return () => {
                        const rootTag = `${key.replace(/[^A-z0-9]/g, "")}-root`;

                        const root = document.createElement(rootTag);

                        root.style.display = "contents";

                        let last: HTMLElement | VNode = root;

                        let noDOM = false;

                        effect(() => {
                            const next = fn!.call(readProxy);

                            if (!next) {
                                noDOM = true;
                                return;
                            }

                            const n = html`<${rootTag} style="contents">${next}</${rootTag}>`;

                            patch(last, n);

                            last = n;
                        });

                        if (noDOM) return;

                        return root;
                    };
                },
            });
        } else if (typeof descriptor.value === "function") {
            proxyMap.set(key, {
                get() {
                    return (...args: any[]) => {
                        try {
                            stateManagement.createDraftLayer();
                            const returnValue = (descriptor.value as AnyFunction).call(
                                modifyProxy,
                                ...args,
                            );
                            stateManagement.applyDraftLayer();
                            return returnValue;
                        } catch (e) {
                            stateManagement.discardDraftLayer();
                            throw e;
                        }
                    };
                },
            });
        } else if (typeof descriptor.get === "function") {
            const computedValue = computed(() => descriptor.get!.call(readProxy), {
                name: key,
            });

            proxyMap.set(key, {
                get() {
                    return computedValue.value;
                },
            });
        } else {
            const state = stateManagement.createState(key, descriptor.value);

            proxyMap.set(key, {
                get(modifyMode) {
                    if (modifyMode) return stateManagement.getDraft(key);
                    return state.value;
                },
                set(value, modifyMode) {
                    if (!modifyMode) return false;
                    stateManagement.replaceDraft(key, value);
                    return true;
                },
            });
        }
    });

    if (ASSERT) console.log({ proxyMap });

    return readProxy as Effectlayer<T>;
};

export { html, jsx };
