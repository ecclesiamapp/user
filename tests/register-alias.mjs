import { registerHooks } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function resolveCandidateFile(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      const targetPath = path.resolve(repoRoot, specifier.slice(2));
      const found = resolveCandidateFile(targetPath);
      if (found) {
        return {
          url: pathToFileURL(found).href,
          shortCircuit: true,
        };
      }
    }

    if (
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      context.parentURL?.startsWith('file:') &&
      !context.parentURL.includes('node_modules')
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const found = resolveCandidateFile(path.resolve(parentDir, specifier));
      if (found) {
        return {
          url: pathToFileURL(found).href,
          shortCircuit: true,
        };
      }
    }

    // Garante resolução de next/server e next/headers em ambiente ESM/Node 24
    if (specifier === 'next/server' || specifier === 'next/headers') {
      return nextResolve(`${specifier}.js`, context);
    }

    return nextResolve(specifier, context);
  },
});

