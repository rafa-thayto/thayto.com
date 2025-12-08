import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
    {
        ignores: ['test/**', 'vitest.config.ts', 'vitest.setup.ts', '**/*.spec.ts', '**/*.spec.tsx'],
    },
    {
        extends: [...nextCoreWebVitals],
    }
]);