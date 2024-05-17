<script setup lang="ts">
import { course_request } from '~/src/config/repositories';
import { Course } from '~/src/modules/course/domain/model';

const route    = useRoute()
const course_id = route.params.course_id as string
const course    = ref<Course>(new Course())

const { request: request_course } = useRequest(async () => {
  course.value = await course_request.get(course_id) ?? new Course()
})

const { pending } = await useLazyAsyncData(async () => {
  await request_course()
})
</script>

<template>
  <main v-if="!pending" class="document">
    <template v-if="course.exists">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/courses/${course.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ course.name }}</h1>
        <p>{{ course.description }}</p>
      </header>

      <div class="page-navigator">
        <nuxt-link :to="`/courses/${course_id}/users`">Usuarios</nuxt-link>
        <template v-if="course.students_count > 0">
          <nuxt-link :to="`/courses/${course_id}/attendances`">Asistencias</nuxt-link>
          <nuxt-link :to="`/courses/${course_id}/courses`">Calificaciones</nuxt-link>
        </template>
      </div>

      <nuxt-page :course="course" />
    </template>
  </main>

  <v-loader v-else />
</template>
