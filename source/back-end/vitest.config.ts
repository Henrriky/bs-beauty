import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/tests/unit/**/*.spec.ts'],
    root: './',
    coverage: {
      reporter: ['text', 'html'],
    },
    setupFiles: ['./src/tests/unit/setup-integration-unit.ts'],
  },
  plugins: [tsConfigPaths()],
})