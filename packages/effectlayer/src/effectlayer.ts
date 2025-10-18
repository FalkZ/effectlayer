import { type VNode, toVNode } from "snabbdom";
import type { Constructor, Simplify } from "type-fest";
import { patch } from "./patch";

import { computed, effect } from "./patched/signals-core";
import { createMapProxy, type ProxyDefinition } from "./proxy-utils";
import { StateManagement } from "./state-management";
import { devAssertType } from "dev-assert";

type AnyFunction = (...args: any[]) => any;

type EffectKey<Key> = Key extends `$${string}` ? Key : never;

type Effects<T extends object> = {
    [Key in EffectKey<keyof T>]: T[Key] extends () => VNode
        ? () => HTMLElement
        : T[Key];
};

type MethodsKeys<
    T extends object,
    Key extends keyof T,
> = Key extends `$${string}` ? never : T[Key] extends AnyFunction ? Key : never;

type Methods<T extends object> = {
    [Key in MethodsKeys<T, keyof T>]: T[Key];
};

export type Effectlayer<T extends object> = Simplify<Methods<T> & Effects<T>>;

export const effectlayer = <T extends object>(
    Class: Constructor<T>,
): Effectlayer<T> => {
    const instance = new Class();
    const instanceDescriptors = Object.getOwnPropertyDescriptors(instance);
    const prototypeDescriptors = Object.getOwnPropertyDescriptors(
        Class.prototype,
    );

    const descriptors = [
        ...Object.entries(instanceDescriptors),
        ...Object.entries(prototypeDescriptors),
    ];

    const stateManagement = new StateManagement();

    const proxyMap = new Map<string | symbol, ProxyDefinition>();

    const readProxy = createMapProxy(instance, proxyMap);
    const modifyProxy = createMapProxy(instance, proxyMap, true);

    descriptors.forEach(([key, descriptor]) => {
        if (key.startsWith("$")) {
            proxyMap.set(key, {
                get() {
                    const fn = descriptor.value;

                    if (typeof fn !== "function") {
                        console.error(`Fields starting with $ must be methods`);

                        return;
                    }

                    devAssertType(
                        fn,
                        (fn): fn is AnyFunction => typeof fn === "function",
                    );

                    // TODO: figure out what to do with args
                    // TODO: return observables
                    return () => {
                        const rootTag = `${key.replace(/[^A-z0-9]/g, "")}-root`;
                        const root = document.createElement(rootTag);
                        root.style.display = "contents";
                        document.body.appendChild(root);

                        let last: VNode = toVNode(root);
                        effect(() => {
                            // TODO: figure out sth, more performant
                            const next = fn.call(readProxy);
                            if (next !== undefined) {
                                patch(last, next);
                                last = next;
                            }
                        });

                        return root;
                    };
                },
            });
        } else if (typeof descriptor.value === "function") {
            proxyMap.set(key, {
                get() {
                    return (...args: unknown[]) => {
                        try {
                            stateManagement.createDraftLayer();
                            const returnValue = (
                                descriptor.value as AnyFunction
                            ).call(modifyProxy, ...args);
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
            const computedValue = computed(
                () => descriptor.get!.call(readProxy),
                { name: key },
            );

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

    return readProxy as Effectlayer<T>;
};

export * from "./types";
