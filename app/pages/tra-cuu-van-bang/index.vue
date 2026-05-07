<script setup lang="ts">
useSeoMeta({
  title: 'Tra cứu văn bằng — Cao đẳng OpenClaw',
  description: 'Hệ thống tra cứu văn bằng của Cao đẳng OpenClaw đang được xây dựng và sẽ ra mắt ở Phase 2.',
  ogTitle: 'Tra cứu văn bằng — Cao đẳng OpenClaw',
  ogDescription: 'Hệ thống tra cứu văn bằng của Cao đẳng OpenClaw đang được xây dựng và sẽ ra mắt ở Phase 2.',
  ogImage: 'https://openclaw.edu.vn/og-home.png',
  ogUrl: 'https://openclaw.edu.vn/tra-cuu-van-bang',
  ogType: 'website',
  ogLocale: 'vi_VN',
})

useHead({
  htmlAttrs: { lang: 'vi' },
})
</script>

<template>
  <div class="site-root">
    <section class="section tra-cuu-hero">
      <div class="container container--narrow">
        <h1 class="section__heading">
          Tra cứu văn bằng
        </h1>
        <p class="section__body">
          Hệ thống tra cứu văn bằng đang được xây dựng và sẽ ra mắt cùng Phase 2. Ở giai đoạn hiện tại, toàn bộ giáo trình đào tạo Trợ lý được công bố công khai — bất kỳ ai cũng có thể đọc và đánh giá chất lượng mà không cần đăng nhập.
        </p>
        <p class="section__body">
          <a href="/" class="link">← Quay về trang chủ</a>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tra-cuu-hero {
  background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 77, 77, 0.12) 0%, transparent 70%),
    var(--bg-deep);
  padding-block: 5rem 4rem;
  min-height: 60vh;
  display: flex;
  align-items: center;
}
</style>
