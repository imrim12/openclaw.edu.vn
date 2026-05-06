// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@vueuse/nuxt',
    'magic-regexp',
    'nuxt-llms',
  ],

  $development: {
    devtools: {
      enabled: true,
    },
    vite: {
      server: {
        allowedHosts: true,
      },
    },
  },

  components: false,

  compatibilityDate: '2025-02-11',

  nitro: {
    preset: 'cloudflare-pages',
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: false,
    },
  },

  llms: {
    domain: 'https://openclaw.edu.vn',
    title: 'openclaw.edu.vn',
    description: 'Static markdown site for openclaw.edu.vn.',
  },
})
