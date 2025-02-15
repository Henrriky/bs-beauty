import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
    const tsConfigPaths = await import('vite-tsconfig-paths');
    const testType = process.env.TEST_TYPE || 'all';
    const includePatterns =
        testType === 'unit'
            ? ['**/*.spec.ts']
            : testType === 'e2e'
                ? ['**/*.e2e-spec.ts']
                : ['**/*.spec.ts', '**/*.e2e-spec.ts'];

    return {
        plugins: [tsConfigPaths.default()],
        test: {
            globals: true,
            includeSource: ['src/**/*.{ts,tsx}'],
            include: includePatterns, 
            coverage: {
                reporter: ['text', 'html'],
            },
        },
    };
});
