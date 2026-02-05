// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Accélération Formule 1 🚀 (Mise en cache intelligente)
  routeRules: {
    '/': { swr: 1 },             // Accueil - revalidation rapide
    '/japan-otaku-festival': { swr: 3600 },
    '/japan-manga-wave': { swr: 3600 },
    '/gamer-connection': { swr: 3600 },
    '/ink-secret': { swr: 3600 },
    '/presse': { swr: 3600 }
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@vueuse/motion/nuxt'
  ],

  // Configuration du runtime
  runtimeConfig: {
    public: {
      wordpressUrl: 'https://japanconventions.com/graphql',
      siteUrl: 'https://japanconventions.com'
    }
  },

  // Styles globaux (~ pointe vers app/ dans Nuxt 4)
  css: [
    '@/assets/scss/main.scss'
  ],

  // Alias pour l'architecture modulaire (style packages Java)
  alias: {
    '~/core': '~/core',
    '~/modules': '~/modules'
  },

  // Auto-import des composables depuis les modules
  imports: {
    dirs: [
      'core/composables',
      'modules/*/composables'
    ]
  },

  // Auto-import des composants depuis les modules
  components: [
    '~/components',
    { path: '~/modules/events/components', prefix: 'Event' },
    { path: '~/modules/festivals/components', prefix: 'Festival' }
  ],

  // Configuration Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_variables.scss" as *;'
        }
      }
    }
  },

  // Optimisation des images
  image: {
    domains: ['japanconventions.com'],
    quality: 80,
    format: ['webp', 'avif', 'jpeg']
  },

  // SEO par défaut
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'fr'
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@900&display=swap' }
      ],
      meta: [
        { name: 'theme-color', content: '#e60012' },
        { name: 'author', content: 'Japan Conventions' }
      ]
    }
  }
})
