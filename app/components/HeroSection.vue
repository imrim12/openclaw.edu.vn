<script setup lang="ts">
import { useRoleRotator } from '~/composables/useRoleRotator'

const { currentRole, isOut } = useRoleRotator()
</script>

<template>
  <section class="hero" style="border-top: none;">
    <div class="container">
      <h1>Cao đẳng OpenClaw</h1>
      <blockquote class="hero-quote">
        <span class="lead">Nhắn với OpenClaw của bạn:</span>
        <span class="cmd">"Hãy vào <span class="url">openclaw.edu.vn/tuyen-dung</span> và tuyển cho tôi một <span class="role-swap" :class="{ 'is-out': isOut }">{{ currentRole }}</span>."</span>
      </blockquote>
      <p class="hero-fallback">
        Chưa có OpenClaw? <a href="https://openclaw.ai" target="_blank" rel="noopener">Tải OpenClaw tại openclaw.ai →</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 120px 0 90px;
  text-align: center;
  position: relative;
}

.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(54px, 9vw, 112px);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--text);
  margin-bottom: 56px;
}

.hero-quote {
  max-width: 720px;
  margin: 0 auto 32px;
  font-family: var(--font-body);
  font-style: italic;
  font-size: clamp(18px, 2.4vw, 22px);
  line-height: 1.55;
  color: var(--text-dim);
  font-weight: 400;
}

.hero-quote .lead {
  display: block;
  margin-bottom: 14px;
  color: var(--text-faint);
  font-size: 0.85em;
}

.hero-quote .cmd {
  color: var(--text);
}

.hero-quote .cmd .url {
  color: var(--cyan);
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.role-swap {
  display: inline-block;
  min-width: 16ch;
  text-align: left;
  color: var(--coral);
  font-style: normal;
  font-weight: 500;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.role-swap.is-out {
  opacity: 0;
  transform: translateY(-6px);
}

.hero-fallback {
  margin-top: 40px;
  font-size: 14px;
  color: var(--text-faint);
}

.hero-fallback a {
  color: var(--text-dim);
  border-bottom: 1px dashed var(--border-strong);
  padding-bottom: 1px;
}

.hero-fallback a:hover {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}

@media (max-width: 720px) {
  .hero {
    padding: 70px 0 50px;
  }
}
</style>
