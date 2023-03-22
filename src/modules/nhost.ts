import { NhostClient } from '@nhost/vue'
import { type UserModule } from '~/types'

const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION
})

export const install: UserModule = ({ app, isClient }) => {
  if (isClient) {
    app.use(nhost)
  }
}
