import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
// import Previewer from 'virtual:vue-component-preview'
import App from './App.vue'
import type { UserModule } from './types'
import { routes as generatedRoutes } from 'vue-router/auto/routes'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

import guardedRoutes from '~/routes/guarded'
import mergeGuardedRoutes from '~/routes/utils/merge-guarded-routes'

import extendedRoutes from '~/routes/extended'

const routes = setupLayouts(
  mergeGuardedRoutes(generatedRoutes.concat(extendedRoutes), guardedRoutes)
)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(
      import.meta.glob<{ install: UserModule }>('./modules/*.ts', {
        eager: true,
      })
    ).forEach((i) => i.install?.(ctx))
    // ctx.app.use(Previewer)
  }
)
