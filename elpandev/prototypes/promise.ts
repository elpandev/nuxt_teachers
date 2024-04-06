interface PromiseConstructor {
  debounce: <T>(fn: () => T, ms: number, key: string) => Promise<T>
  delay: (ms: number) => Promise<void>
}

const debounces: Map<string, any> = new Map()

Promise.delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

Promise.debounce = <T>(fn: () => T, ms: number, key: string): Promise<T> => {
  debounces.has(key)
    ? clearTimeout(debounces.get(key))
    : debounces.set(key, 0)

  return new Promise(resolve => {
    debounces.set(key, setTimeout(() => resolve(fn()), ms))
  })
}