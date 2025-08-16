// ESLint flat config para monorepo
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  // Base JS para todo el repo
  js.configs.recommended,

  // Reglas para funciones (Node ESM)
  {
    files: ["netlify/functions/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Globals Web API disponibles en Node 18+/20 (undici)
        fetch: "readonly",
        Response: "readonly",
        Request: "readonly",
        Headers: "readonly",
        console: "readonly",
        URL: "readonly",
        process: "readonly",
      },
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Reglas para TypeScript/React del frontend
  {
    files: ["packages/frontend/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        alert: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Evita falsos positivos en TS para tipos DOM (HTMLAudioElement, etc.)
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react/react-in-jsx-scope": "off",
    },
  },

  // Ignora salidas de build
  {
    ignores: [
      "**/node_modules/**",
      "packages/frontend/dist/**",
      // Artefactos de Netlify Dev/Build
      "**/.netlify/**",
      "packages/frontend/.netlify/**",
      // Otros cachés temporales
      "**/.cache/**",
    ],
  },
];
