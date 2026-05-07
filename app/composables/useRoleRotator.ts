import { ref, shallowRef } from 'vue'

const ROLES = [
  'Trợ lý Kế toán Doanh nghiệp',
  'Trợ lý Luật Thương mại',
  'Trợ lý Quản trị Vận hành',
] as const

export function useRoleRotator() {
  const currentRole = shallowRef<string>(ROLES[0])
  const isOut = ref(false)
  let idx = 0

  useIntervalFn(() => {
    isOut.value = true
    useTimeoutFn(() => {
      idx = (idx + 1) % ROLES.length
      const next = ROLES[idx]
      if (next !== undefined)
        currentRole.value = next
      isOut.value = false
    }, 400)
  }, 2500)

  return { currentRole, isOut }
}
