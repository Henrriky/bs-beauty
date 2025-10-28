import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import { config } from 'dotenv'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

export default defineConfig({
  test: {
    globals: true,
    include: ['src/tests/integration/**/*.integration.spec.ts'],
    root: './',
    coverage: {
      reporter: ['text', 'html'],
    },
    setupFiles: ['./src/tests/integration/setup-integration-tests.ts'],
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 15000
  },
  plugins: [tsConfigPaths()],
})