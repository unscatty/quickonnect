import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  documents: [
    'src/components/**/*.vue',
    'src/composables/**/*.{ts,js,tsx,jsx}',
    'src/layouts/**/*.vue',
    'src/pages/**/*.vue',
    'src/graphql/**/**.{ts,js,tsx,jsx}',
  ],
  generates: {
    'src/graphql/generated/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
      plugins: [],
    },
  },
}

export default config
