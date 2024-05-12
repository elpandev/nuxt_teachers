export function useRequest<T>(fn: (...args: any[]) => Promise<void>) {
  const count     = ref<number>(0)
  const pending   = ref<boolean>(false)
  const completed = ref<boolean>(false)

  async function request(...args: any[]): Promise<void> {
    if (pending.value) return

    count.value++

    pending  .value = true
    completed.value = false

    try {
      await fn(...args)

      completed.value = true
    }

    catch (error) {
      console.error(error)
    }

    pending.value = false
  }

  return { request: request as (...args: any[]) => Promise<T>, pending, completed, count }
}
