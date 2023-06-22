import { defineConfig } from 'vitest/config';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [viteTsConfigPaths()],
	test: {
		coverage: {
			exclude: ['src/domain/@core/*.ts', 'src/domain/validation/**/*.ts']
		}
	}
});
