import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            parser: tsParser,
            ecmaVersion: 12,
            sourceType: "module",

            parserOptions: {
                project: "tsconfig.json",
            },
        },

        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".ts"],
                },
            },
        },

        rules: {
            "no-console": "error",
            strict: ["error", "global"],
            curly: "off",
            eqeqeq: "off",
            "jsx-quotes": "off",
            "dot-notation": "off",
            semi: "off",
            quotes: "off",
            "no-floating-decimal": "off",
            "prettier/prettier": 0,
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "no-debugger": "off",
            "no-duplicate-imports": "error",
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];