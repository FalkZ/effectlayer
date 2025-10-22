# It just works! – opinionated linting & formatting

This package gives you type-aware linting and formatting for Javascript, Typescript, and React.

In detail it includes recommended rules from:

- @eslint/js
- typescript-eslint
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-jsx-a11y (opt in)

## Installation

```bash
npm install --save-dev ijw eslint prettier typescript
```

## ESLint

Create this `eslint.config.js` file:

```js
import createConfig from "ijw/eslint";
const config = createConfig();
export default config;
```

<details>
<summary>With accessibility rules enabled:</summary>

```js
import createConfig from "ijw/eslint";
const config = createConfig({
    accessibility: true,
});
export default config;
```

> Delete the `.eslintignore` file, if existing in your project.

</details>

## Typescript

Create the following `tsconfig.json` file:

```json
{
    "extends": "ijw/typescript",
    "include": ["src"]
}
```

## Prettier

Add the following line to your `package.json` file:

```json
{
    // ...
    "prettier": "ijw/prettier"
}
```

> Delete any existing prettier config files from your project.
