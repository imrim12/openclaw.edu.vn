<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 32 })

const uid = `seal-${Math.random().toString(36).slice(2, 7)}`
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <defs>
      <path :id="uid" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
    </defs>
    <circle cx="50" cy="50" r="46" fill="none" stroke="#2a3450" stroke-width="1" />
    <circle cx="50" cy="50" r="42" fill="none" stroke="#2a3450" stroke-width="0.5" />
    <text font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="2" fill="#9aa3b8">
      <textPath :href="`#${uid}`" start-offset="0">CAO ĐẲNG OPENCLAW · MMXXVI · </textPath>
    </text>
    <text x="50" y="55" text-anchor="middle" font-family="Clash Display, sans-serif" font-size="22" font-weight="600" fill="#ff4d4d">OC</text>
  </svg>
</template>
