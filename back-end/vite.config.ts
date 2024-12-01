import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
    const tsConfigPaths = await import('vite-tsconfig-paths');
    return {
        plugins: [tsConfigPaths.default()],
    test: {
        includeSource: ['src/**/*.{ts,tsx}'],
        coverage: {
                reporter: ['text', 'html'],
            },
            globals: true,
        },
    };
});
