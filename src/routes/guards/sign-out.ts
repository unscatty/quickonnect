import type { NavigationGuard, RouteLocationRaw } from 'vue-router'
import nhost from '~/services/nhost-client'

export const signoutGuard = (
  redirectTo: RouteLocationRaw
): NavigationGuard => {
  return async (_, __, next) => {
    const isAuthenticated = await nhost.auth.isAuthenticatedAsync()

    if (isAuthenticated) {
      const signedOut = await nhost.auth.signOut()
      await nhost.auth.refreshSession()

      if (signedOut.error) {
        next(new Error(signedOut.error.message))
      } else {
        next(redirectTo)
      }
    } else {
      next(false)
    }
  }
}
