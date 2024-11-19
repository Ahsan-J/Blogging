import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: process.cwd(),
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["dist/**/*", "coverage/**/*", "*.config.js", "main.d.ts"],
    },
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
            sourceType: "module"
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
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
];