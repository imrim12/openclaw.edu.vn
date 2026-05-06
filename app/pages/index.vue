<script setup lang="ts">
const { data: page } = useAsyncData('content-index', () => {
  return queryCollection('content').path('/').first()
})
</script>

<template>
  <main>
    <ContentRenderer
      v-if="page"
      :value="page"
    />
  </main>
</template>
