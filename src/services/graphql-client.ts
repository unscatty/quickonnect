import nhost from './nhost-client'
import { GraphQLClient } from 'graphql-request'

type AuthHeaderProps = {
  authorization?: string
}

const gqlClient = new GraphQLClient(nhost.graphql.httpUrl, {
  headers: () => {
    const authHeaders = {} as AuthHeaderProps

    if (nhost.auth.isAuthenticated()) {
      authHeaders['authorization'] = `Bearer ${nhost.auth.getAccessToken()}`
    }

    return {
      'Content-Type': 'application/json',
      ...authHeaders,
    }
  },
})

export default gqlClient
