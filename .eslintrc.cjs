module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    './.eslintrc-auto-import.json',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  overrides: [
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      parserOptions: {
        schema: './schema.graphql'
      },
      plugins: ['@graphql-eslint'],
      extends: 'plugin:@graphql-eslint/schema-recommended'
    }
  ],
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  ignorePatterns: [
    'dist/*',
    'cypress/*',
    '*.css',
    'src/auto-imports.d.ts',
    'src/components.d.ts',
    'src/types.ts',
    'src/shims.d.ts',
    'src/client.d.ts',
    'src/graphql/generated/**/*',
    'patches/*',
    'pnpm-lock.yaml',
    'index.html',
    'schema.graphql'
  ],
  globals: {
    defineOptions: 'readonly',
    defineModel: 'readonly',
  },
  rules: {
    // override/add rules settings here, such as:
    'vue/no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/object-curly-spacing': [2, 'always'],
    'vue/html-closing-bracket-spacing': [
      2,
      {
        selfClosingTag: 'always',
      },
    ],
    // 'vue/max-attributes-per-line': [
    //   2,
    //   {
    //     singleline: {
    //       max: 1,
    //     },
    //     multiline: {
    //       max: 1,
    //     },
    //   },
    // ],
  },
}
