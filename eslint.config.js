import { defineConfig, Runtime } from '@santi020k/eslint-config-basic'

export default await defineConfig({
  detectRootDir: import.meta.dirname,
  ignores: [
    'dist/**',
    'scratch/**',
    '**/*.json',
    '**/*.md',
    '**/*.svg'
  ],
  features: {
    jsonc: false,
    markdown: false,
    perfectionist: false,
    zod: false
  },
  runtime: Runtime.Universal
},
{
  files: ['eslint.config.js'],
  rules: {
    'n/no-unpublished-import': 'off'
  },
},
{
  files: ['scripts/*.mjs'],
  rules: {
    'n/hashbang': 'off',
    'n/no-process-exit': 'off',
    'n/no-unpublished-import': 'off',
    'no-unused-vars': 'off',
    'promise/param-names': 'off'
  }
})
