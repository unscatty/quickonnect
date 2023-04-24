import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
// import Preview from 'vite-plugin-vue-component-preview'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Vue from '@vitejs/plugin-vue'
import LinkAttributes from 'markdown-it-link-attributes'
import Shiki from 'markdown-it-shiki'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros'
import Codegen from 'vite-plugin-graphql-codegen'
import Inspect from 'vite-plugin-inspect'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'
import Inspector from 'vite-plugin-vue-inspector'
import Layouts from 'vite-plugin-vue-layouts'
import Markdown from 'vite-plugin-vue-markdown'
import generateSitemap from 'vite-ssg-sitemap'
import {
  getRemoteSchema,
  printSchemaToFile,
} from './vite/utils/get-graphl-schema'
import { transformShortVmodel } from '@vue-macros/short-vmodel'

export default defineConfig(async ({ mode }) => {
  // Fetch schema from endpoint to a file
  // Get env vars to get access to remote schema
  const env = loadEnv(mode, process.cwd(), 'CODEGEN_')
  const {
    CODEGEN_GRAPHQL_ENDPOINT,
    CODEGEN_GRAPHQL_ADMIN_SECRET,
    CODEGEN_SCHEMA_FILE,
  } = env

  try {
    // Fetch schema from endpoint with permissions
    const schema = await getRemoteSchema(CODEGEN_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': CODEGEN_GRAPHQL_ADMIN_SECRET,
      },
    })

    console.log(`Successfully fetched schema from ${CODEGEN_GRAPHQL_ENDPOINT}`)

    // Save schema to a file
    printSchemaToFile(path.resolve(__dirname, CODEGEN_SCHEMA_FILE), schema)

    console.log(`Schema fetched to file: ${CODEGEN_SCHEMA_FILE}`)
  } catch (e) {
    console.error(
      `Failed to  fetched schema from ${CODEGEN_GRAPHQL_ENDPOINT}\nIs server running?`
    )
    throw e
  }

  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [
      // Preview(),

      VueMacros.vite({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
            reactivityTransform: true,
            template: {
              compilerOptions: {
                nodeTransforms: [
                  transformShortVmodel({
                    prefix: '$',
                  }),
                ],
              },
            },
          }),
        },
        betterDefine: false,
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          'vue/macros',
          '@vueuse/head',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: ['src/composables/**/*', 'src/stores/**/*'],
        vueTemplate: true,
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),

      // https://github.com/antfu/vite-plugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left',
        headEnabled: true,
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(Shiki, {
            theme: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
          })
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
        },
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
        manifest: {
          name: 'Vitesse',
          short_name: 'Vitesse',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/antfu/vite-plugin-inspect
      // Visit http://localhost:4000/__inspect/ to see the inspector
      Inspect(),

      // https://github.com/webfansplz/vite-plugin-vue-inspector
      Inspector({
        toggleButtonVisibility: 'never',
        toggleComboKey: 'alt-i',
      }),
      Codegen({
        configFilePathOverride: path.resolve(__dirname, 'graphql-codegen.ts'),
        enableWatcher: true,
      }),
    ],

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi'],
      },
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      onFinished() {
        generateSitemap()
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window', /vue-i18n/],
    },
  }
})
