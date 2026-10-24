// Builds the adapter package that design-sync converts: dist/index.js (adapters + bundle.js),
// dist/index.d.ts, dist/liquid-glass.css (tokens.css + bundle.css) and guides/ (the brand book).
// Run from the repo root after `make build`: node .design-sync/react/build.mjs
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../..');
const ds = join(repo, 'design-system');
const tokens = join(repo, 'tools/.cache/tokens.css');
if (!existsSync(tokens)) {
  console.error('tools/.cache/tokens.css is missing: run `make build` first');
  process.exit(1);
}
const { build } = await import(pathToFileURL(join(repo, '.ds-sync/node_modules/esbuild/lib/main.js')).href);

rmSync(join(here, 'dist'), { recursive: true, force: true });
rmSync(join(here, 'guides'), { recursive: true, force: true });
mkdirSync(join(here, 'dist'), { recursive: true });

await build({
  entryPoints: [join(here, 'src/index.jsx')],
  outfile: join(here, 'dist/index.js'),
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  target: 'es2019',
  logLevel: 'warning',
});
cpSync(join(here, 'src/index.d.ts'), join(here, 'dist/index.d.ts'));
writeFileSync(
  join(here, 'dist/liquid-glass.css'),
  readFileSync(tokens, 'utf8') + '\n' + readFileSync(join(ds, 'components/bundle.css'), 'utf8'),
);

// Brand book and per-component guidance, renamed so that no two files share a name.
const guides = join(here, 'guides');
mkdirSync(join(guides, 'components'), { recursive: true });
cpSync(join(ds, 'README.md'), join(guides, 'brand-book.md'));
for (const f of readdirSync(ds)) if (/^\d-.*\.md$/.test(f)) cpSync(join(ds, f), join(guides, f));
for (const c of readdirSync(join(ds, 'components'))) {
  const md = join(ds, 'components', c, 'README.md');
  if (existsSync(md)) cpSync(md, join(guides, 'components', `${c}.md`));
}
console.error('adapter package built: dist/ and guides/');
