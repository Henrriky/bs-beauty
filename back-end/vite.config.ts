import { defineConfig } from 'vitest/config'

defineConfig({
    test: {
        coverage: {
            reporter: ['text', 'html']
        }
    }
})