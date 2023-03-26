import { type UserModule } from '~/types'
import nhost from '~/services/nhost-client'

export const install: UserModule = ({ app }) => {
  app.use(nhost)
}
