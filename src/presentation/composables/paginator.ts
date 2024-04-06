import { nano_id } from "@/elpandev/utils/methods/nano_id";

enum PaginatorStatus {
  PENDING   = 'PENDING',
  FETCHING  = 'FETCHING',
  COMPLETED = 'COMPLETED',
}

export function usePaginator<T>(request: (page: number, limit: number, last: T) => Promise<T[]>) {
  const data      = ref<T[]>([])
  const page      = ref<number>(1)
  const limit     = ref<number>(12)
  const status    = ref<PaginatorStatus>(PaginatorStatus.PENDING)
  const pending   = computed<boolean>(() => status.value == PaginatorStatus.PENDING)
  const fetching  = computed<boolean>(() => status.value == PaginatorStatus.FETCHING)
  const completed = computed<boolean>(() => status.value == PaginatorStatus.COMPLETED)

  async function paginate(): Promise<void> {
    status.value = PaginatorStatus.FETCHING

    const elements = await request(page.value, limit.value, data.value[data.value.length - 1] as T)

    elements.isNotEmpty() && data.value.push(...elements as any)

    elements.length == limit.value
      ? status.value = PaginatorStatus.PENDING
      : status.value = PaginatorStatus.COMPLETED
  }

  function restart() {
    data  .value = []
    page  .value = 1
    status.value = PaginatorStatus.PENDING
  }

  useLazyAsyncData(nano_id(), () => paginate(), { watch: [page] })

  return {
    data,
    page,
    pending,
    fetching,
    completed,
    restart,
    paginate,
  }
}
