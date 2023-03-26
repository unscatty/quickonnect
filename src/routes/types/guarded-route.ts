import { RouteRecordRaw } from 'vue-router'

type GuardedRoute = Pick<RouteRecordRaw, 'path' | 'beforeEnter' | 'meta'>

export default GuardedRoute
