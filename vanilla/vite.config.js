import { defineConfig } from 'vite';
import { globSync } from 'node:fs';
import { resolve } from 'path';

const exercisePages = globSync('exercises/**/index.html').reduce((entries, filePath) => {
  const name = filePath.replace(/\/index\.html$/, '').replaceAll('/', '-');
  entries[name] = resolve(__dirname, filePath);
  return entries;
}, {});

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...exercisePages,
      },
    },
  },
});
