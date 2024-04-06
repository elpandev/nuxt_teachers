export function useModal() {
  const enabled = ref<boolean>(false)

  function open()  { enabled.value = true }
  function close() { enabled.value = false }

  return { enabled, open, close }
}
