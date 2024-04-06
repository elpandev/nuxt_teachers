<script setup lang="ts" generic="T extends BaseModel">
  import type { BaseModel } from '~/elpandev/hexagonal/base/domain/model';

  interface IProps {
    request: Promise<T[]>
  }

  interface IEmits {
    (e: 'closed'): void
  }

  const props = defineProps<IProps>()
  const emit  = defineEmits<IEmits>()

  const { data, pending } = await useLazyAsyncData(async () => {
    const models = await props.request

    return { models }
  })
</script>

<template>
  <v-modal class="models" @closed="emit('closed')">
    <slot name="header" />
    <slot name="body" :models="data?.models" />
    <slot name="footer" />
  </v-modal>
</template>

<style lang="scss">
.modal.models {
  > .container {
    padding: 21px;
  }
}
</style>