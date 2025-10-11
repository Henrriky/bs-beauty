import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  target: "es2020",
  format: ["cjs"],
  clean: true,
  sourcemap: false,
  minify: true,
  skipNodeModulesBundle: true,
  exclude: [
    "src/tests/**/*",
    "tests/**/*",
    "**/*.spec.ts",
    "**/*.test.ts",
  ],
  external: ["vitest", "supertest", "@faker-js/faker"],
});

