<script setup lang="ts">
useSeoMeta({ title: 'Giới thiệu — Cao đẳng OpenClaw' })
</script>

<template>
  <div class="placeholder-page">
    <div class="container">
      <p class="back">
        <a href="/">← Trang chủ</a>
      </p>
      <h1>Giới thiệu</h1>
      <p class="status">
        Đang chuẩn bị
      </p>
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 28px;
}

.back {
  font-size: 14px;
  margin-bottom: 32px;
}

.back a {
  color: var(--text-dim);
}

.back a:hover {
  color: var(--cyan);
}

h1 {
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 48px);
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--text);
  margin-bottom: 16px;
}

.status {
  color: var(--coral);
  font-family: var(--font-mono);
  font-size: 14px;
}
</style>
