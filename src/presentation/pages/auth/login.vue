<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import type { IBaseAuthRepositoryLogin } from '~/elpandev/hexagonal/base/domain/auth_repository';
import { auth_request } from '~/src/config/repositories';

const data      = reactive<IBaseAuthRepositoryLogin>({ email: 'javoavmystery@gmail.com', password: '123456' })
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} })) 

const { request, pending } = useRequest(async () => {
  try {
    await auth_request.login(data)
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

useSeoMeta({
  title: 'Ingresar'
})
</script>

<template>
  <form class="form" @submit.prevent="request">
    <v-form-input
      v-model="data.email"
      :label="'Email'"
      :errors="(validator?.errors.email as string[])"
    />
    <v-form-input
      v-model="data.password"
      :label="'Contraseña'"
      :type="'password'"
      :errors="(validator?.errors.password as string[])"
    />
    <v-loader v-if="pending" />
    <button v-else class="button outline text teal" type="submit">Ingresar</button>
  </form>
</template>