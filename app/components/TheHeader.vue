<script setup lang="ts">
import TheSeal from '~/components/TheSeal.vue'
</script>

<template>
  <header>
    <div class="container nav">
      <a href="/" class="brand">
        <TheSeal :size="32" />
        <span>Cao đẳng OpenClaw</span>
      </a>
      <nav class="nav-links">
        <a href="#co-che">Cơ chế</a>
        <a href="#khoa">Khoa</a>
        <a href="#cai-dat">Cài đặt</a>
        <a href="#giao-trinh">Giáo trình</a>
        <a href="/tuyen-dung">Tuyển dụng</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  background: rgba(5, 8, 16, 0.7);
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.01em;
}

.brand:hover {
  color: var(--text);
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-links a {
  color: var(--text-dim);
  font-size: 14px;
  font-weight: 500;
}

.nav-links a:hover {
  color: var(--text);
}

@media (max-width: 720px) {
  .nav-links {
    display: none;
  }
}
</style>
