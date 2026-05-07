<script setup lang="ts">
import { resolveComponent } from 'vue'

defineProps<{
  name: string
  status: string
  phase: string
  progress: number
  teaser: string
  recruitHref: string
}>()

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <article class="khoa-card">
    <div class="khoa-card__header">
      <h3 class="khoa-card__name">
        {{ name }}
      </h3>
      <span class="khoa-card__phase">
        {{ phase }}
      </span>
    </div>
    <p class="khoa-card__status">
      {{ status }}
    </p>
    <div
      class="khoa-card__progress-bar"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Tiến độ chuẩn bị: ${progress}%`"
    >
      <div
        class="khoa-card__progress-fill"
        :style="{ width: `${progress}%` }"
      />
    </div>
    <p class="khoa-card__teaser">
      {{ teaser }}
    </p>
    <component
      :is="NuxtLink"
      :to="recruitHref"
      class="khoa-card__cta"
    >
      Tuyển trợ lý này
    </component>
  </article>
</template>

<style scoped>
.khoa-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s;
}

.khoa-card:hover,
.khoa-card:focus-within {
  border-color: var(--border-accent);
}

.khoa-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.khoa-card__name {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--text-primary);
  margin: 0;
}

.khoa-card__phase {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--coral-bright);
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.25);
  border-radius: 4px;
  padding: 0.125rem 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.khoa-card__status {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
}

.khoa-card__progress-bar {
  height: 4px;
  background: rgba(136, 146, 176, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.khoa-card__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--coral-bright), var(--cyan-bright));
  border-radius: 2px;
  transition: width 0.4s ease;
}

.khoa-card__teaser {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.khoa-card__cta {
  margin-top: 0.25rem;
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--coral-bright);
  background: transparent;
  border: 1px solid var(--border-accent);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  align-self: flex-start;
  outline-offset: 2px;
  text-decoration: none;
  display: inline-block;
}

.khoa-card__cta:hover {
  background: rgba(255, 77, 77, 0.1);
  border-color: var(--coral-bright);
}

.khoa-card__cta:focus-visible {
  outline: 2px solid var(--coral-bright);
}
</style>
