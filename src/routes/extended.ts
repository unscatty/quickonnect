import { RouteRecordRaw } from 'vue-router'
import { signoutGuard } from './guards/sign-out'

const extendedRoutes: RouteRecordRaw[] = [
  {
    path: '/sign-out',
    component: import('~/components/Empty.vue'),
    beforeEnter: signoutGuard('/auth')
  },
]

export default extendedRoutes
