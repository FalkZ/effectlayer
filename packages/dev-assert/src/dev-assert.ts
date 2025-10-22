class AssertionError extends Error {
    context?: unknown;

    constructor(message?: string, context?: unknown) {
        super(message);
        this.name = "AssertionError";
        this.context = context;
    }
}

export const devAssert = (
    condition: boolean | (() => boolean),
    message?: string,
    context?: unknown,
) => {
    if (typeof condition === "function" ? !condition() : !condition) {
        if (context !== undefined)
            console.error(
                `AssertionError: ${message || "Assertion failed"}\n`,
                context,
            );
        else console.error(`AssertionError: ${message || "Assertion failed"}`);
        throw new AssertionError(message, context);
    }
};

export function devAssertType<T, A extends T>(
    value: T,
    predicate: (value: T) => value is A,
    message?: string,
    context?: unknown,
): asserts value is A {
    if (!predicate(value)) {
        if (context !== undefined)
            console.error(
                `AssertionError: ${message || "Assertion failed"}\n`,
                context,
            );
        else console.error(`AssertionError: ${message || "Assertion failed"}`);
        throw new AssertionError(message, context);
    }
}
