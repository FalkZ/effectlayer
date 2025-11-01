#!/usr/bin/env node

import degit from "degit";
import prompts from "prompts";
import kleur from "kleur";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";

const main = async () => {
    console.log(kleur.cyan("Initialize Effectlayer App"));

    const response = await prompts([
        {
            type: "text",
            name: "dir",
            message: "Project directory:",
            initial: "effectlayer-app",
            validate: (value) => {
                if (!value) return "Directory name is required";
                return true;
            },
        },
    ]);

    if (!response.dir) {
        console.log(kleur.red("Aborted"));
        process.exit(1);
    }

    const targetDir = resolve(process.cwd(), response.dir);

    if (existsSync(targetDir)) {
        const { overwrite } = await prompts({
            type: "confirm",
            name: "overwrite",
            message: `Directory ${response.dir} already exists. Overwrite?`,
            initial: false,
        });

        if (!overwrite) {
            console.log(kleur.red("Aborted"));
            process.exit(1);
        }
    } else {
        await mkdir(targetDir, { recursive: true });
    }

    console.log(kleur.gray(`Creating project in ${targetDir}...`));

    const emitter = degit("github:falkz/effectlayer/packages/template", {
        cache: false,
        force: true,
        verbose: false,
    });

    await emitter.clone(targetDir);

    console.log(kleur.green("✓ Project created"));
    console.log();
    console.log("Next steps:");
    console.log(kleur.gray(`  cd ${response.dir}`));
    console.log(kleur.gray("  npm install"));
    console.log(kleur.gray("  npm run dev"));
};

main().catch((err) => {
    console.error(kleur.red(err.message));
    process.exit(1);
});
