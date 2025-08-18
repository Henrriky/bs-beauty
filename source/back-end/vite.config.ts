import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
    const tsConfigPaths = await import('vite-tsconfig-paths');
    const testType = process.env.TEST_TYPE || 'all';
    const includeByType: Record<string, string[]> = {
        unit: [
            '**/*.spec.ts',
            '**/*.unit.test.ts',
        ],
        int: [
            '**/*.integration.spec.ts'
        ],
    };

    return {
        plugins: [tsConfigPaths.default()],
        test: {
            globals: true,
            includeSource: ['src/**/*.{ts,tsx}'],
            include: includeByType[testType] ?? ['**/*.spec.ts', '**/*.test.ts', '**/*.integration.spec.ts'],
            setupFiles: ['./tests/test-env.ts'],
            coverage: {
                reporter: ['text', 'html'],
            },
        },
    };
});
