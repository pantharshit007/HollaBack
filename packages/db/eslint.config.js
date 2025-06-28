import { config } from "@hback/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
    { ignores: ["dist/**"] },
    ...config,
]
