export function useRequest<T>(fn: (...args: any[]) => Promise<T>) {
  const count     = ref<number>(0)
  const data      = ref<T>()
  const pending   = ref<boolean>(false)
  const completed = ref<boolean>(false)

  async function request(...args: any[]): Promise<void> {
    if (pending.value) return

    count.value++

    pending  .value = true
    completed.value = false

    try {
      data.value = await fn(...args)

      completed.value = true
    }

    catch (error) {
      console.error(error)
    }

    pending.value = false
  }

  return { request: request as (...args: any[]) => Promise<T>, pending, completed, data, count }
}
