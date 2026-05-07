<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>

<template>
  <img
    src="/logo.svg"
    alt="OpenClaw"
    :width="props.size"
    :height="props.size"
    aria-hidden="true"
  >
</template>
