import { isAuthenticatedGuard } from './guards'
import GuardedRoute from './types/guarded-route'

/**
 * Routes with guards/meta-info
 */
const guardedRoutes: GuardedRoute[] = [
  {
    path: '/',
    beforeEnter: isAuthenticatedGuard('/auth'),
  },
]

export default guardedRoutes
