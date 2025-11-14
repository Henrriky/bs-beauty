import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/tests/unit/**/*.spec.ts'],
    root: './',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'prisma/**',
        'build/**',
        'src/config/**',
        'src/lib/**',
        'src/repository/**',
        'src/router/**',
        'src/types/**',
        'src/tests/**',
        'src/factory/**',
        'src/server.ts',
        'src/utils/logger/**',
        'src/utils/validation/zod-schemas/**',
        'src/app.ts',
        'src/utils/scheduler.ts',
        'src/middlewares/data-validation/**',
        'src/middlewares/pagination/**',
        'custom.d.ts',
        '*.config.ts'
      ]
    },
    setupFiles: ['./src/tests/unit/setup-integration-unit.ts'],
  },
  plugins: [tsConfigPaths()],
})