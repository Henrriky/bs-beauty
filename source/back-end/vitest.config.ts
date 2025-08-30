import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/unit/**/*.spec.ts'],
    root: './',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  plugins: [tsConfigPaths()], 
})