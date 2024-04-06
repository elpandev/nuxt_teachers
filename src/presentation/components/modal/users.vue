<script setup lang="ts">
  import { user_request } from '~/src/config/repositories';
  import type { UserFilter } from '~/src/modules/user/domain/filter';


  interface IProps {
    filter: UserFilter
  }

  interface IEmits {
    (e: 'closed'): void
  }

  const props = defineProps<IProps>()
  const emit  = defineEmits<IEmits>()

  const { data, pending } = await useLazyAsyncData(async () => {
    const users = await user_request.all(props.filter)

    return { users }
  })
</script>

<template>
  <v-modal class="users" @closed="emit('closed')">
    <slot name="header" />
    <slot name="body" :users="data?.users" />
    <slot name="footer" />
  </v-modal>
</template>

<style lang="scss">
.modal.users {
  > .container {
    padding: 21px;
  }
}
</style>