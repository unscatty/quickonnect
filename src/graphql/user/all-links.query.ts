import { graphql } from '~/graphql/generated'

export const USER_ALL_LINKS_QUERY = graphql(`
  query UserAllLinks {
    links {
      name
      type
      url
    }
  }
`)
