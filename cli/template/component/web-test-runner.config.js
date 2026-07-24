import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';

// Sources import with `.js` extensions (so `tsc` emits correct ESM), but the
// dev server serves `.ts`. Rewrite relative `.js` specifiers to `.ts` for our
// own modules; leave bare specifiers (lit, @open-wc/*) to nodeResolve.
const tsExtensionResolver = {
  name: 'resolve-ts-from-js',
  resolveImport({ source, context }) {
    const importer = context?.path ?? '';
    const fromOurSource = !importer.includes('/node_modules/');
    return fromOurSource && source.startsWith('.') && source.endsWith('.js')
      ? `${source.slice(0, -3)}.ts`
      : undefined;
  },
};

export default {
  files: 'src/*.test.ts',
  nodeResolve: true,
  plugins: [
    tsExtensionResolver,
    esbuildPlugin({ ts: true, target: 'esnext', tsconfig: './tsconfig.test.json' }),
  ],
  browsers: [playwrightLauncher({ product: 'chromium' })],
  testFramework: { config: { timeout: 3000 } },
};
