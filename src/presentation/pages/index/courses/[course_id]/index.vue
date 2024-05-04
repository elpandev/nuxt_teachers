<script setup lang="ts">
import { course_request } from '~/src/config/repositories';

const route     = useRoute()
const course_id = route.params.course_id as string

const { data, pending } = await useLazyAsyncData(async () => {
  const course = await course_request.get(course_id)

  return { course }
})
</script>

<template>
  <main v-if="!pending" class="document">
    <template v-if="data?.course">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/courses/${data.course.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ data.course.name }}</h1>
        <p>{{ data.course.description }}</p>
      </header>

      <div class="page-navigator">
        <nuxt-link :to="`/courses/${course_id}/users`">Usuarios</nuxt-link>
        <template v-if="data.course.students_count > 0">
          <nuxt-link :to="`/courses/${course_id}/attendances`">Asistencias</nuxt-link>
          <nuxt-link :to="`/courses/${course_id}/grades`">Calificaciones</nuxt-link>
        </template>
      </div>

      <nuxt-page :course="data.course" />
    </template>
    <span v-else>El curso no existe</span>
  </main>
  <v-loader v-else />
</template>
