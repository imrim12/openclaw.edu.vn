<script setup lang="ts">
import KhoaCard from '~/components/KhoaCard.vue'

interface KhoaEntry {
  name: string
  slug: string
  status: string
  phase: string
  progress: number
  teaser: string
  recruitHref: string
}

const khoaList = [
  {
    name: 'Khoa Luật',
    slug: 'luat',
    phase: 'Phase 2 · Q3 2026',
    status: 'Đang chuẩn bị · ra mắt Phase 2 · Q3 2026',
    progress: 35,
    teaser: 'Hỗ trợ soạn thảo và rà soát hợp đồng dịch vụ, hợp đồng lao động, hợp đồng nguyên tắc giữa các pháp nhân Việt Nam theo Bộ luật Dân sự 2015 và Luật Thương mại 2005. Trợ lý biết từ chối các nội dung ngoài thẩm quyền và đề xuất Khoa phù hợp.',
    recruitHref: '/tuyen-dung#luat',
  },
  {
    name: 'Khoa Tài chính - Kế toán',
    slug: 'tai-chinh-ke-toan',
    phase: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progress: 10,
    teaser: 'Hỗ trợ kê khai thuế giá trị gia tăng (GTGT), soạn tờ khai hằng tháng, trích dẫn Thông tư 40/2021/TT-BTC và các Thông tư hiện hành. Phù hợp cho chủ doanh nghiệp và kế toán dịch vụ cần tăng năng suất xử lý hồ sơ thuế định kỳ.',
    recruitHref: '/tuyen-dung#tai-chinh-ke-toan',
  },
  {
    name: 'Khoa Quản trị Vận hành',
    slug: 'quan-tri-van-hanh',
    phase: 'Phase 3+',
    status: 'Đang chuẩn bị · ra mắt Phase 3+',
    progress: 5,
    teaser: 'Hỗ trợ xử lý hồ sơ đấu thầu, soạn thảo quy trình nội bộ, quản lý hợp đồng vận hành và thủ tục hành chính doanh nghiệp. Được thiết kế cho doanh nghiệp 30–200 nhân sự cần chuẩn hoá quy trình vận hành.',
    recruitHref: '/tuyen-dung#quan-tri-van-hanh',
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
})

useHead({
  htmlAttrs: { lang: 'vi' },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Tuyển Dụng Trợ lý — Cao đẳng OpenClaw',
        'url': 'https://openclaw.edu.vn/tuyen-dung',
        'description': 'Danh sách Trợ lý AI chuyên ngành có thể tuyển cho doanh nghiệp Việt Nam.',
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
            :slug="khoa.slug"
            :name="khoa.name"
            :status="khoa.status"
            :phase="khoa.phase"
            :progress="khoa.progress"
            :teaser="khoa.teaser"
            :recruit-href="khoa.recruitHref"
          />
        </div>
        <p class="section__note">
          Chưa có Trợ lý nào đang hoạt động ở Phase 1. Tất cả đang trong giai đoạn đào tạo và chuẩn bị giáo trình.
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
