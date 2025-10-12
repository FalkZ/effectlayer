const examples = import.meta.glob("./*-example.tsx");

const moduleMap = new Map();

Object.entries(examples).forEach(([key, value]) => {
    const name = key.replace("./", "").replace("-example.tsx", "");

    moduleMap.set(name, value);
});

window.addEventListener("hashchange", () => location.reload());

const example = moduleMap.get(window.location.hash.slice(1));

console.log(moduleMap);
if (example) {
    example().then(() => {
        console.log("Example loaded");
    });
} else {
    console.log("No example found");
}
