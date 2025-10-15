import { devAssertType, devAssert } from "./dev-assert";

type Test = {
    test: number;
};

const main = (test?: object) => {
    let a = test;
    devAssert(true, "hello");
    devAssertType(test, (t): t is Test => typeof t === "object");

    let b = test;

    devAssert(false, "hello 2");

    console.log("end");
};

try {
    main({ test: 1 });
} catch (error) {
    console.error(error);
}

try {
    main();
} catch (error) {
    console.error(error);
}
