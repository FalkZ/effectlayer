import { writeFileSync } from "node:fs";
import { html as htmlProperties } from "property-information";

const booleanProps: string[] = [];

const normals = Object.entries(htmlProperties.normal);

Object.entries(htmlProperties.property).forEach(([key, value]) => {
    if (value.boolean) {
        booleanProps.push(key);

        normals.forEach(([otherName, name]) => {
            if (name === key && otherName !== name) {
                booleanProps.push(otherName);
            }
        });
    }
});

writeFileSync("./src/patched/boolean-props.json", JSON.stringify(booleanProps, null, 2));
