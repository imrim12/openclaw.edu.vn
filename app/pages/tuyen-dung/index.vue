<script setup lang="ts">
import KhoaCard from '~/components/KhoaCard.vue'
import { khoaList } from '~/data/khoa'

useSeoMeta({
  title: 'Tuyển Dụng Trợ lý — Cao đẳng OpenClaw',
  description: 'Danh sách Trợ lý AI chuyên ngành có thể tuyển cho doanh nghiệp Việt Nam — Luật, Kế toán, Quản trị Vận hành.',
  ogTitle: 'Tuyển Dụng Trợ lý — Cao đẳng OpenClaw',
  ogDescription: 'Danh sách Trợ lý AI chuyên ngành có thể tuyển cho doanh nghiệp Việt Nam — Luật, Kế toán, Quản trị Vận hành.',
  ogImage: 'https://openclaw.edu.vn/og-home.png',
  ogUrl: 'https://openclaw.edu.vn/tuyen-dung',
  ogType: 'website',
  ogLocale: 'vi_VN',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Tuyển Dụng Trợ lý — Cao đẳng OpenClaw',
  twitterDescription: 'Danh sách Trợ lý AI chuyên ngành có thể tuyển cho doanh nghiệp Việt Nam — Luật, Kế toán, Quản trị Vận hành.',
  twitterImage: 'https://openclaw.edu.vn/og-home.png',
})

useHead({
  htmlAttrs: { lang: 'vi' },
  link: [
    { rel: 'alternate', type: 'text/plain', title: 'OpenClaw corpus index', href: 'https://cdn-openclaw-edu.opencloud.com.vn/llms.txt' },
    { rel: 'alternate', type: 'application/json', title: 'OpenClaw manifest', href: 'https://cdn-openclaw-edu.opencloud.com.vn/api/manifest.json' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Tuyển Dụng Trợ lý — Cao đẳng OpenClaw',
        'url': 'https://openclaw.edu.vn/tuyen-dung',
        'description': 'Danh sách Trợ lý AI chuyên ngành có thể tuyển cho doanh nghiệp Việt Nam.',
        'mainEntity': {
          '@type': 'DataCatalog',
          'url': 'https://cdn-openclaw-edu.opencloud.com.vn/api/manifest.json',
          'name': 'OpenClaw corpus manifest',
        },
        'isPartOf': {
          '@type': 'EducationalOrganization',
          'name': 'Cao đẳng OpenClaw',
          'url': 'https://openclaw.edu.vn',
        },
      }),
    },
  ],
})
</script>

<template>
  <div class="site-root">
    <section class="section tuyen-dung-hero">
      <div class="container">
        <h1 class="section__heading tuyen-dung-hero__title">
          Tuyển Dụng Trợ lý
        </h1>
        <p class="section__intro">
          Trợ lý đầu tiên (Khoa Luật) ra mắt Phase 2 — Q3 2026. Các Khoa bên dưới đang trong giai đoạn chuẩn bị.
        </p>
      </div>
    </section>

    <section class="section section--surface">
      <div class="container">
        <div class="khoa-grid">
          <div
            v-for="khoa in khoaList"
            :id="khoa.sectionId"
            :key="khoa.slug"
          >
            <KhoaCard
              :name="khoa.name"
              :status="khoa.status"
              :phase-badge="khoa.phaseBadge"
              :progress-pct="khoa.progressPct"
              :teaser="khoa.teaser"
              :cta-href="khoa.recruitHref"
            />
          </div>
        </div>
        <p class="section__note">
          Hiện tại chưa có Trợ lý nào đang hoạt động — tất cả đang trong giai đoạn đào tạo và chuẩn bị giáo trình.
        </p>
      </div>
    </section>

    <div class="container tuyen-dung-back">
      <a href="/" class="tuyen-dung-back__link">← Trang chủ</a>
    </div>
  </div>
</template>

<style scoped>
.tuyen-dung-hero {
  background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 77, 77, 0.12) 0%, transparent 70%),
    var(--bg-deep);
  padding-block: 3rem 2rem;
}

.tuyen-dung-hero__title {
  font-size: clamp(2rem, 4vw, 3rem);
}

.tuyen-dung-back {
  padding-block: 2rem;
}

.tuyen-dung-back__link {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}

.tuyen-dung-back__link:hover {
  color: var(--text-primary);
}
</style>
