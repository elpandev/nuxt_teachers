<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { course_request } from '~/src/config/repositories';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import type { Course } from '~/src/modules/course/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar         = useSnackbar()
const filter           = reactive<CourseFilter>(new CourseFilter({ teachers: true, order: { path: 'name', direction: OrderDirectionEnum.ASC } }))
const searcher_enabled = ref<boolean>(false)
const courses          = ref<Course[]>([])
const courses_count    = ref<number>(0)

const { request: destroy } = useRequest(async (course_id: string) => {
  try {
    await course_request.destroy(course_id)

    courses.value.removeWhere(course => course.id == course_id)

    snackbar.value.success(`El curso ha sido eliminado`)
  }

  catch (error) {
    console.error(error)
  }
})

const { request: request_courses } = useRequest(async () => {
  courses.value = await course_request.paginate(filter)
})

const { request: request_courses_count } = useRequest(async () => {
  courses_count.value = await course_request.count(filter) as number
})


const { request: search } = useRequest(async () => {
  await Promise.all([
    request_courses(),
    request_courses_count(),
  ])
})

onMounted(search)
</script>

<template>
  <v-custom-header-primary :name="`Cursos (${ courses_count })`">
    <template #buttons>
      <nuxt-link to="/courses/create" class="button solid text teal">Nuevo Curso</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main class="documents">
    <div class="actions">
      <button class="action download"><v-icon-download /> Descagar</button>
      <button class="action search" :class="{ enabled: searcher_enabled }" @click="searcher_enabled = !searcher_enabled"><v-icon-search/></button>
    </div>

    <div v-if="searcher_enabled" class="container page-filter">
      <v-input v-model="filter.name" :placeholder="'Nombre'" />

      <button class="button solid text teal" @click="search()">Buscar</button>
    </div>

    <div class="container table-courses-container">
      <table class="table">
        <thead>
          <tr>
            <v-th-orderable
              v-model = "filter.order"
              :name   = "'Nombre'"
              :path   = "'name'"
              @update:model-value="search()"
            />
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Profesor'"
              :path    = "'teacher_name'"
              @update:model-value="search()"
            />
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Estudiantes'"
              :path    = "'students_count'"
              @update:model-value="search()"
            />
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td class="ellipsis">{{ course.name }}</td>
            <td class="ellipsis">{{ course.teacher_name }}</td>
            <td>{{ course.students_count }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/courses/${course.id}/users`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/courses/${course.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy(course.id)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style lang="scss">
.table-courses-container {
  padding: 15px 18px;
}
</style>
