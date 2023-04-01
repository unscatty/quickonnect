import { graphql } from '~/graphql/generated'

export const ALL_LINKS_QUERY = graphql(`
  query UserAllLinks {
    links {
      ...LinkInfo
    }
  }
`)
