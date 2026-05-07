<script setup lang="ts">
import { useProgressFill } from '~/composables/useProgressFill'

const props = defineProps<{
  name: string
  phaseBadge: string
  status: string
  progressPct: number
  teaser: string
  ctaHref: string
}>()

const { fillEl, width } = useProgressFill(props.progressPct)
</script>

<template>
  <article class="faculty-card">
    <div class="faculty-header">
      <h3 class="faculty-name">
        {{ name }}
      </h3>
      <span class="phase-badge">{{ phaseBadge }}</span>
    </div>
    <p class="faculty-status">
      {{ status }}
    </p>
    <div>
      <div class="progress">
        <div
          ref="fillEl"
          class="progress-fill"
          :style="{ width }"
        />
      </div>
      <p class="progress-label">
        Chuẩn bị giáo trình · {{ progressPct }}%
      </p>
    </div>
    <p class="faculty-teaser">
      {{ teaser }}
    </p>
    <a :href="ctaHref" class="faculty-cta">
      Tuyển trợ lý này <span class="arrow">→</span>
    </a>
  </article>
</template>

<style scoped>
.faculty-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px 28px 24px;
  transition: border-color 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faculty-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

.faculty-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.faculty-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--text);
}

.phase-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  background: var(--coral-soft);
  color: var(--coral);
  border-radius: 999px;
  white-space: nowrap;
  font-weight: 500;
}

.faculty-status {
  font-size: 13px;
  color: var(--text-faint);
  font-weight: 400;
}

.progress {
  height: 4px;
  background: var(--bg-deep);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--coral));
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 6px;
}

.faculty-teaser {
  font-size: 14px;
  color: var(--text-dim);
  line-height: 1.6;
  flex: 1;
}

.faculty-cta {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  color: var(--cyan);
  align-self: flex-start;
  padding: 9px 16px;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  transition: all 0.2s;
}

.faculty-cta:hover {
  border-color: var(--cyan);
  background: var(--cyan-soft);
  color: var(--cyan);
}

.faculty-cta .arrow {
  transition: transform 0.2s;
}

.faculty-cta:hover .arrow {
  transform: translateX(3px);
}
</style>
