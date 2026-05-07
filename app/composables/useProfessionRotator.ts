import { computed, onMounted, onUnmounted, shallowRef } from 'vue'

const PROFESSIONS = [
  'Trợ lý Kế toán Doanh nghiệp',
  'Trợ lý Luật Thương mại',
  'Trợ lý Quản trị Vận hành',
] as const

const INTERVAL_MS = 2500

export function useProfessionRotator() {
  const currentIndex = shallowRef(0)

  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % PROFESSIONS.length
    }, INTERVAL_MS)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return {
    currentProfession: computed(() => PROFESSIONS[currentIndex.value]),
    currentIndex,
  }
}
