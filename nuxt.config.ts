export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: 'icon.png' }
      ]
    }
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/src/assets/scss/variables.scss" as *;'
        }
      }
    }
  },
  components: [
    {
      path: './src/presentation/components',
      prefix: 'V',
    },
  ],
  imports: {
    dirs: [
      './src/helpers',
      './src/interfaces',
      './src/methods',
      './src/presentation/composables',
    ]
  },
  dir: {
    pages: './src/presentation/pages',
    layouts: './src/presentation/layouts',
    middleware: './src/presentation/middlewares',
    assets: './src/assets',
    plugins: './src/plugins',
  },
  css: [
    '~/src/assets/scss/main.scss'
  ],
})