<template>
  <main v-if="!pending" class="create">
    <template v-if="user_id && !user.exists">
      <span>Este usuario no existe</span>
    </template>

    <header>
      <h1>{{ title }}</h1>
    </header>

    <form class="form" @submit.prevent="store()">
      <template v-if="!user_id">
        <v-selector v-model="user_role_option" :label="'Rol'" :options="user_role_options" />
      </template>

      <v-input :label="'Nombre'" v-model="user.name" />
      <v-input :label="'Email'"  v-model="user.email" />

      <v-loader v-if="store_pending" />

      <button v-else class="button outline text teal" type="submit">Guardar</button>
    </form>
  </main>

  <v-loader v-else />
</template>

<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { UserFactory } from '~/src/modules/user/domain/factory';
import { user_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { User, UserRoleEnum, user_role_locale, user_role_options } from '~/src/modules/user/domain/model';
import { SelectOption } from '~/src/presentation/models/select_option';

const props     = defineProps<{ user_id?: string }>()
const title     = `${ props.user_id ? 'Editar' : 'Nuevo' } Usuario`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()
const user      = ref<User>(new User())

const user_role_option = computed<SelectOption<UserRoleEnum>>({
  get() { return new SelectOption({ id: user.value.role, name: user_role_locale(user.value.role), value: user.value.role }) },
  set(option) { user.value.role = option.value }
})

const { request: store, pending: store_pending } = useRequest(async () => {
  try {
    props.user_id
      ? await user_request.update(props.user_id, user.value.toPayload())
      : await user_request.store(user.value)

    snackbar.value.success(`El usuario "${user.value.name}" ha sido creado`)

    if (props.user_id === undefined) {
      user.value = new UserFactory().generate()
    }
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

const { request: request_user } = useRequest(async () => {
    user.value = typeof props.user_id == 'string'
      ? await user_request.get(props.user_id) ?? new User()
      : new UserFactory().generate()
})

const { pending } = await useLazyAsyncData(nano_id(), async () => {
  await request_user()
})

useSeoMeta({ title })
</script>
