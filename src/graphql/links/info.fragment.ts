import { graphql } from "~/graphql/generated";

export const LINK_INFO_FRAGMENT = graphql(`
  fragment LinkInfo on links {
    id
    name
    type
    url
  }
`)
