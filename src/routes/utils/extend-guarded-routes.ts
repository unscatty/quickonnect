import { RouteRecordRaw } from 'vue-router'
import GuardedRoute from '../types/guarded-route'

/**
 * Merges routes with guard/meta info form another array of route
 * definitions, avoiding duplication
 * @param routes The original routes
 * @param guardedRoutes Routes with guards and meta info
 * @returns Routes merged with guards and meta info
 */
const mergeExtendedRoutes = (
  routes: RouteRecordRaw[],
  guardedRoutes: GuardedRoute[]
): RouteRecordRaw[] => {
  guardedRoutes.forEach((guardedRoute) => {
    const matchingRoute = routes.find(
      (route) => route.path === guardedRoute.path
    )

    if (matchingRoute) {
      matchingRoute.beforeEnter = guardedRoute.beforeEnter
      matchingRoute.meta = {
        ...matchingRoute.meta,
        ...guardedRoute.meta,
      }
    }
  })

  return routes
}

export default mergeExtendedRoutes
