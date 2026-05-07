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

  routeRules: {
    '/': {
      prerender: true,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' },
    },
    '/tuyen-dung': {
      prerender: true,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' },
    },
    '/robots.txt': { prerender: false },
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: false,
    },
  },

  fonts: {
    families: [
      { name: 'Clash Display', provider: 'fontshare', weights: [700] },
      { name: 'Satoshi', provider: 'fontshare', weights: [400, 500, 700] },
    ],
  },

  llms: {
    domain: 'https://openclaw.edu.vn',
    title: 'Cao đẳng OpenClaw',
    description: 'Trường nghề đào tạo Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam. Giáo trình công khai, bằng cấp xác thực, hành nghề có giới hạn.',
  },
})
