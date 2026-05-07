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
    '/tra-cuu-van-bang': {
      prerender: true,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' },
    },
    '/tro-ly/luat-thuong-mai': {
      prerender: true,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' },
    },
    '/tro-ly/ke-toan-doanh-nghiep': {
      prerender: true,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' },
    },
    '/tro-ly/quan-tri-van-hanh': {
      prerender: true,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' },
    },
    '/gioi-thieu': { prerender: true, headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
    '/hoi-dong-hoc-thuat': { prerender: true, headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
    '/quy-che': { prerender: true, headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
    '/dong-gop': { prerender: true, headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
    '/khoa': { prerender: true, headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
    '/robots.txt': { prerender: false },
    '/llms.txt': {
      prerender: false,
      redirect: { to: 'https://cdn-openclaw-edu.opencloud.com.vn/llms.txt', statusCode: 302 },
    },
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: false,
    },
  },

  css: ['~/assets/css/tokens.css'],

  fonts: {
    families: [
      { name: 'Clash Display', provider: 'fontshare', weights: [400, 500, 600, 700] },
      { name: 'Satoshi', provider: 'fontshare', weights: [300, 400, 500, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 600] },
    ],
  },

  llms: {
    domain: 'https://openclaw.edu.vn',
    title: 'Cao đẳng OpenClaw',
    description: 'Trường nghề đào tạo Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam. Giáo trình công khai, quản lý phiên bản bằng git.',
  },
})
