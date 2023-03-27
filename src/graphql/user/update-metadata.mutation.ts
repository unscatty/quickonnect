import { graphql } from '~/graphql/generated'

export const USER_UPDATE_METADATA_MUTATION = graphql(`
  mutation UserUpdateMetadata(
    $id: uuid!
    $displayName: String!
    $metadata: jsonb
  ) {
    userData: updateUser(
      pk_columns: { id: $id }
      _set: { displayName: $displayName, metadata: $metadata }
    ) {
      displayName
      metadata
    }
  }
`)
