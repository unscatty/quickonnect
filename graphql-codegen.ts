import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './schema.graphql',
  documents: [
    'src/components/**/*.vue',
    'src/layouts/**/*.vue',
    'src/pages/**/*.vue',
    'src/graphql/**/**.graphql',
  ],
  generates: {
    'src/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
