import { effectlayer } from "effectlayer";

const examples = import.meta.glob("./*-example.tsx");

const moduleMap = new Map();

Object.entries(examples).forEach(([key, value]) => {
    const name = key.replace("./", "").replace("-example.tsx", "");

    moduleMap.set(name, value);
});

window.addEventListener("hashchange", () => location.reload());

const example = moduleMap.get(window.location.hash.slice(1));

if (example) {
    example().then(() => {
        console.log("Example loaded");
    });
} else {
    class ExamplesList {
        $ui() {
            return (
                <>
                    {[...moduleMap.keys()].map((name) => (
                        <a key={name} href={`#${name}`}>
                            {name}
                        </a>
                    ))}
                </>
            );
        }
    }

    const examplesList = effectlayer(ExamplesList);

    document.body.appendChild(examplesList.$ui());
}
