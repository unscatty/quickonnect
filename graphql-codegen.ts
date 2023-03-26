import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8080/v1/graphql',
  documents: [
    'src/components/**/*.vue',
    'src/layouts/**/*.vue',
    'src/pages/**/*.vue',
    'src/graphql/**/**.graphql',
  ],
  generates: {
    'src/graphql/generated': {
      preset: 'client',
      plugins: [],
    },
  },
  watch: true,
}

export default config
