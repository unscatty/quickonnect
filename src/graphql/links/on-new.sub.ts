import { graphql } from '~/graphql/generated'

export const ON_NEW_LINK_SUBSCRIPTION = graphql(`
  subscription NewLinks {
    newLinks: links {
      ...LinkInfo
    }
  }
`)
