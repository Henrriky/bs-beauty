import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
    const tsConfigPaths = await import('vite-tsconfig-paths');
    const testType = process.env.TEST_TYPE || 'all';
    const isIntegration = testType === 'int';
    const isUnit = testType === 'unit';
    const includeByType: Record<string, string[]> = {
        unit: ['tests/unit/**/*.spec.ts', 'tests/**/*.unit.test.ts'],
        int: ['tests/integration/**/*.integration.spec.ts'],
    };

    return {
        plugins: [tsConfigPaths.default()],
        test: {
            globals: true,
            includeSource: ['src/**/*.{ts,tsx}'],
            include: includeByType[testType] ?? [
                'tests/unit/**/*.spec.ts',
                'tests/integration/**/*.integration.spec.ts',
            ],
            exclude: isUnit ? ['tests/integration/**'] : isIntegration ? ['tests/unit/**'] : [],
            setupFiles: isIntegration ? ['./tests/test-env.integration.ts'] : [],
            coverage: {
                reporter: ['text', 'html'],
            },
            fileParallelism: isIntegration ? false : undefined,
            sequence: { concurrent: false },
        },
    };
});
