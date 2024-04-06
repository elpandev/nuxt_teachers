export function useRequest<T, U extends (...args: any[]) => Promise<T>>(fn: U) {
  const pending   = ref<boolean>(false)
  const completed = ref<boolean>(false)

  async function request(...args: any[]): Promise<void> {
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

  return { request: request as U, pending, completed }
}
