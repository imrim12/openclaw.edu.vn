import { ref } from 'vue'

export function useProgressFill(targetPct: number) {
  const fillEl = ref<HTMLElement | null>(null)
  const width = ref('0%')

  useIntersectionObserver(
    fillEl,
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry?.isIntersecting) {
        width.value = `${targetPct}%`
      }
    },
    { threshold: 0.4 },
  )

  return { fillEl, width }
}
