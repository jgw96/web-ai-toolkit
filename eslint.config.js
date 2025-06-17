import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';

export default [
    // Base JavaScript rules
    js.configs.recommended,

    // TypeScript files configuration
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                navigator: 'readonly',
                self: 'readonly',
                Summarizer: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                FileReader: 'readonly',
                AudioContext: 'readonly',
                fetch: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'import': importPlugin,
            'n': nodePlugin,
            'promise': promisePlugin,
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/no-unused-vars': ['error', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_'
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-inferrable-types': 'error',

            // Import rules
            'import/order': ['error', {
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index'
                ],
                'newlines-between': 'always',
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true
                }
            }],
            'import/no-duplicates': 'error',

            // Promise rules
            'promise/always-return': 'error',
            'promise/no-return-wrap': 'error',
            'promise/param-names': 'error',
            'promise/catch-or-return': 'error',
            'promise/no-nesting': 'warn',
            'promise/no-promise-in-callback': 'warn',

            // Code quality rules
            'no-console': 'warn',
            'no-debugger': 'error',
            'no-unused-vars': 'off', // Use TypeScript version instead
            'no-async-promise-executor': 'warn', // Allow async promise executors with warning

            // Style rules
            'indent': ['error', 2],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],

            // Best practices
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-return-assign': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unused-expressions': 'error',
            'prefer-const': 'error',
            'prefer-arrow-callback': 'error',
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
    },

    // Test files configuration
    {
        files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**/*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'no-console': 'off',
        },
    },

    // Configuration files
    {
        files: ['*.config.js', '*.config.ts', 'vite.config.*', 'vitest.config.*'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
            'no-console': 'off',
        },
    },

    // Global ignores
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '*.min.js',
            'coverage/**',
        ],
    },
];
