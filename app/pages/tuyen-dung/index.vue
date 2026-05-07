<script setup lang="ts">
import KhoaCard from '~/components/KhoaCard.vue'

interface KhoaEntry {
  name: string
  slug: string
  status: string
  phaseBadge: string
  progressPct: number
  teaser: string
  ctaHref: string
}

const khoaList = [
  {
    name: 'Khoa Luật',
    slug: 'luat',
    phaseBadge: 'Phase 2 · Q3 2026',
    status: 'Đang chuẩn bị · ra mắt Phase 2 · Q3 2026',
    progressPct: 35,
    teaser: 'Hỗ trợ soạn thảo và rà soát hợp đồng dịch vụ, hợp đồng lao động, hợp đồng nguyên tắc giữa các pháp nhân Việt Nam theo Bộ luật Dân sự 2015 và Luật Thương mại 2005. Trợ lý biết từ chối các nội dung ngoài thẩm quyền và đề xuất Khoa phù hợp.',
    ctaHref: 'mailto:tin@openclaw.edu.vn?subject=%C4%90%C4%83ng%20k%C3%BD%20nh%E1%BA%ADn%20tin%20Khoa%20Lu%E1%BA%ADt',
  },
  {
    name: 'Khoa Tài chính - Kế toán',
    slug: 'tai-chinh-ke-toan',
    phaseBadge: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progressPct: 10,
    teaser: 'Hỗ trợ kê khai thuế giá trị gia tăng (GTGT), soạn tờ khai hằng tháng, trích dẫn Thông tư 40/2021/TT-BTC và các Thông tư hiện hành. Phù hợp cho chủ doanh nghiệp và kế toán dịch vụ cần tăng năng suất xử lý hồ sơ thuế định kỳ.',
    ctaHref: 'mailto:tin@openclaw.edu.vn?subject=%C4%90%C4%83ng%20k%C3%BD%20nh%E1%BA%ADn%20tin%20Khoa%20T%C3%A0i%20ch%C3%ADnh%20-%20K%E1%BA%BF%20to%C3%A1n',
  },
  {
    name: 'Khoa Quản trị Vận hành',
    slug: 'quan-tri-van-hanh',
    phaseBadge: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progressPct: 5,
    teaser: 'Hỗ trợ xử lý hồ sơ đấu thầu, soạn thảo quy trình nội bộ, quản lý hợp đồng vận hành và thủ tục hành chính doanh nghiệp. Được thiết kế cho doanh nghiệp 30–200 nhân sự cần chuẩn hoá quy trình vận hành.',
    ctaHref: 'mailto:tin@openclaw.edu.vn?subject=%C4%90%C4%83ng%20k%C3%BD%20nh%E1%BA%ADn%20tin%20Khoa%20Qu%E1%BA%A3n%20tr%E1%BB%8B%20V%E1%BA%ADn%20h%C3%A0nh',
  },
] satisfies KhoaEntry[]

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
          <KhoaCard
            v-for="khoa in khoaList"
            :key="khoa.slug"
            :name="khoa.name"
            :status="khoa.status"
            :phase-badge="khoa.phaseBadge"
            :progress-pct="khoa.progressPct"
            :teaser="khoa.teaser"
            :cta-href="khoa.ctaHref"
          />
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
