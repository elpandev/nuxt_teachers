<script setup lang="ts">
import { grade_request } from '~/src/config/repositories';
import { Grade } from '~/src/modules/grade/domain/model';

const route    = useRoute()
const grade_id = route.params.grade_id as string
const grade    = ref<Grade>(new Grade())

const { request: request_grade } = useRequest(async () => {
  grade.value = await grade_request.get(grade_id) ?? new Grade()
})

const { pending } = await useLazyAsyncData(async () => {
  await request_grade()
})
</script>

<template>
  <main v-if="!pending" class="document">
    <template v-if="grade.exists">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/grades/${grade.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ grade.name }}</h1>
        <p>{{ grade.description }}</p>
      </header>

      <div class="page-navigator">
        <nuxt-link :to="`/grades/${grade_id}/users`">Usuarios</nuxt-link>
      </div>

      <nuxt-page :grade="grade" />
    </template>
  </main>

  <v-loader v-else />
</template>
