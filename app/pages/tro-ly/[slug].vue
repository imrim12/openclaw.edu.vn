<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const ASSISTANTS: Record<string, { name: string, phase: string, timeline: string }> = {
  'ke-toan-doanh-nghiep': {
    name: 'Trợ lý Kế toán Doanh nghiệp',
    phase: 'Phase 3+',
    timeline: 'Phase 3+',
  },
  'luat-thuong-mai': {
    name: 'Trợ lý Luật Thương mại',
    phase: 'Phase 2 · Q3 2026',
    timeline: 'Phase 2 (Q3 2026)',
  },
  'quan-tri-van-hanh': {
    name: 'Trợ lý Quản trị Vận hành',
    phase: 'Phase 3+',
    timeline: 'Phase 3+',
  },
}

const assistant = computed(() => ASSISTANTS[slug.value] ?? null)

useSeoMeta({
  title: computed(() => assistant.value ? `${assistant.value.name} — Cao đẳng OpenClaw` : 'Trợ lý — Cao đẳng OpenClaw'),
  description: computed(() => assistant.value ? `${assistant.value.name} đang trong giai đoạn đào tạo. Ra mắt ${assistant.value.timeline}.` : 'Trợ lý đang trong giai đoạn đào tạo.'),
  ogImage: 'https://openclaw.edu.vn/og-home.png',
  ogType: 'website',
  ogLocale: 'vi_VN',
  twitterCard: 'summary_large_image',
})

useHead({ htmlAttrs: { lang: 'vi' } })
</script>

<template>
  <div class="site-root">
    <section class="tro-ly-section">
      <div class="container container--narrow">
        <template v-if="assistant">
          <div class="tro-ly-phase">
            {{ assistant.phase }}
          </div>
          <h1 class="section__heading tro-ly-heading">
            {{ assistant.name }}
          </h1>
          <p class="section__body">
            Trợ lý này đang trong giai đoạn đào tạo và sẽ sẵn sàng vào {{ assistant.timeline }}. Bạn có thể xem danh sách đầy đủ tại trang Tuyển Dụng.
          </p>
        </template>
        <template v-else>
          <h1 class="section__heading tro-ly-heading">
            Trợ lý không tồn tại
          </h1>
          <p class="section__body">
            Không tìm thấy Trợ lý này. Vui lòng xem danh sách đầy đủ tại trang Tuyển Dụng.
          </p>
        </template>
        <p class="section__body tro-ly-back">
          <a href="/tuyen-dung" class="link">← Xem tất cả Trợ lý</a>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tro-ly-section {
  background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 77, 77, 0.12) 0%, transparent 70%),
    var(--bg-deep);
  padding-block: 5rem 4rem;
  min-height: 60vh;
  display: flex;
  align-items: flex-start;
}

.tro-ly-phase {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--coral-bright);
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.25);
  border-radius: 4px;
  padding: 0.125rem 0.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tro-ly-heading {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  margin-bottom: 1.5rem;
}

.tro-ly-back {
  margin-top: 2rem;
}
</style>
