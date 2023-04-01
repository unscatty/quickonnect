import { graphql } from "~/graphql/generated";

export const LinkInfoFragment = graphql(`
  fragment LinkInfo on links {
    id
    name
    type
    url
  }
`)
