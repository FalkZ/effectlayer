import "./index.css";

import { effectlayer } from "effectlayer";

const examples = import.meta.glob("./example-*.tsx");
const moduleMap = new Map();

Object.entries(examples).forEach(([key, value]) => {
    const name = key
        .replace("./", "")
        .replace("example-", "")
        .replace(".tsx", "");

    moduleMap.set(name, value);
});

window.addEventListener("hashchange", () => location.reload());

class ExamplesNav {
    $ui() {
        return (
            <nav>
                {[...moduleMap.keys()].map((name) => (
                    <a key={name} href={`#${name}`}>
                        {name}
                    </a>
                ))}
            </nav>
        );
    }
}

const examplesNav = effectlayer(ExamplesNav);

document.body.appendChild(examplesNav.$ui());

const example = moduleMap.get(window.location.hash.slice(1));

if (example) {
    example().then(() => {
        console.log("Example loaded");
    });
}
