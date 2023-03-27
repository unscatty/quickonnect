import { DefaultApolloClient } from '@vue/apollo-composable'
import { type UserModule } from '~/types'
import apolloClient from '~/services/apollo-client'

export const install: UserModule = ({ app }) => {
  app.provide(DefaultApolloClient, apolloClient)
}
