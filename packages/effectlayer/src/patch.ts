import {
    attributesModule,
    classModule,
    eventListenersModule,
    init,
    propsModule,
    styleModule,
} from "snabbdom";

export const patch = init(
    [
        attributesModule,
        eventListenersModule,
        classModule,
        propsModule,
        styleModule,
    ],
    undefined,
    {
        experimental: {
            fragments: true,
        },
    },
);
