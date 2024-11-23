import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vite.config.ts',
  {
    extends: 'vite.config.ts',
    test: {
      testTimeout: 2000000,
      browser: {
        enabled: true,
        name: 'edge',
        provider: 'preview',
      },
    },
  },
])
