import type { NavigationGuard, RouteLocationRaw } from 'vue-router'
import nhost from '~/services/nhost-client'

export const isAuthenticatedGuard = (
  redirectTo: RouteLocationRaw
): NavigationGuard => {
  return async (_, __, next) => {
    const isAuthenticated = await nhost.auth.isAuthenticatedAsync()

    if (isAuthenticated) {
      next()
    } else {
      next(redirectTo)
    }
  }
}
