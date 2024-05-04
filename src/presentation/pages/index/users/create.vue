<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { UserFactory } from '~/src/modules/user/domain/factory';
import { user_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { UserRoleEnum, user_role_locale, user_role_options } from '~/src/modules/user/domain/model';
import { SelectOption } from '~/src/presentation/models/select_option';

const props     = defineProps<{ user_id?: string }>()
const title     = `${ props.user_id ? 'Editar' : 'Nuevo' } Usuario`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()

const user_role_option = computed<SelectOption<UserRoleEnum>>({
  get() { return new SelectOption({ id: data.value!.user!.role, name: user_role_locale(data.value!.user!.role), value: data.value!.user!.role }) },
  set(option) { data.value!.user!.role = option.value }
})

const store = useRequest(async () => {
  try {
    props.user_id
      ? await user_request.update(props.user_id, data.value!.user!)
      : await user_request.store(data.value!.user!)

    snackbar.value.success(`El usuario "${data.value!.user!.name}" ha sido creado`)

    if (props.user_id === undefined) {
      data.value!.user = new UserFactory().generate()
    }
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
  const user = props.user_id
    ? await user_request.get(props.user_id)
    : new UserFactory().generate()

  return { user }
})

useSeoMeta({ title })
</script>

<template>
  <main v-if="!pending" class="create">
    <template v-if="data?.user">
      <header>
        <h1>{{ title }}</h1>
      </header>
      <form class="form" @submit.prevent="store.request()">
        <v-selector v-model="user_role_option" :label="'Rol'" :options="user_role_options" />

        <v-input  :label="'Nombre'" v-model="data.user.name" />
        <v-input  :label="'Email'"  v-model="data.user.email" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
