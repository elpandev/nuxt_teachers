<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import type { IBaseAuthRepositoryRegister } from '~/elpandev/hexagonal/base/domain/auth_repository';
import { auth_request } from '~/src/config/repositories';
import { User } from '~/src/modules/user/domain/model';

const data = reactive<IBaseAuthRepositoryRegister>({
  id:       new User().id,
  name:     'Francisco Moncayo',
  email:    'javoavmystery@gmail.com',
  password: '123456',
  password_confirmation: '123456',
})

const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))

const { request, pending } = useRequest(async () => {
  try {
    await auth_request.register(data)
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

useSeoMeta({
  title: 'Registrarse'
})
</script>

<template>
  <form class="register" @submit.prevent="request()">
    <v-input
      v-model="data.name"
      :label="'Nombre'"
      :errors="(validator?.errors.name as string[])"
    />
    <v-input
      v-model="data.email"
      :label="'Email'"
      :errors="(validator?.errors.email as string[])"
    />
    <v-input
      v-model="data.password"
      :label="'Contraseña'"
      :type="'password'"
      :errors="(validator?.errors.password as string[])"
    />
    <v-input
      v-model="data.password_confirmation"
      :label="'Confirmación de Contraseña'"
      :type="'password'"
      :errors="(validator?.errors.password_confirmation as string[])"
    />
    <v-loader v-if="pending" />
    <button v-else class="button outline text teal" type="submit">Registrarse</button>
  </form>
</template>

<style lang="scss">
form.register {
  display: grid;
  gap: 18px;
}
</style>
