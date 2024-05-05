<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { course_request } from '~/src/config/repositories';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { TableEnum } from '~/src/presentation/enums/tables';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar = useSnackbar()
const filter   = reactive<CourseFilter>(new CourseFilter({ teachers: true, order: { path: 'name', direction: OrderDirectionEnum.ASC } }))

const destroy = useRequest(async (course_id: string) => {
  try {
    await course_request.destroy(course_id)

    data.value?.courses.removeWhere(course => course.id == course_id)

    snackbar.value.success(`El curso ha sido eliminado`)
  }

  catch (error) {
    console.error(error)
  }
})

async function request_data() {
  const [courses] = await Promise.all([
    course_request.paginate  (filter),
    // course_request.count(filter),
  ])

  return { courses, count: 0 }
}

async function search_by_input() {
  filter.order = undefined

  data.value = await Promise.debounce(request_data, 1500, TableEnum.COURSES)
}

async function search_by_order() {
  if (filter.order == undefined) {
    filter.order = {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }

  data.value = await request_data()
}

const { data, pending } = await useLazyAsyncData(request_data)
</script>

<template>
  <v-custom-header-primary :name="`Cursos (${ data?.count })`">
    <template #buttons>
      <nuxt-link to="/courses/create" class="button solid text teal">Nuevo Curso</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main class="documents">
    <div class="container filters">
      <v-input v-model       ="filter.name"           :type="'text'"   :placeholder="'nombre...'"                  @update:model-value="search_by_input" />
      <v-input v-model.number="filter.students_count" :type="'number'" :placeholder="'cantidad de estudiantes...'" @update:model-value="search_by_input" />
    </div>

    <div class="container">
      <table v-if="!pending" class="table">
        <thead>
          <tr>
            <v-th-orderable
              v-model = "filter.order"
              :name   = "'Nombre'"
              :path   = "'name'"
              @update:model-value="search_by_order"
            />
            <th>Profesor</th>
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Estudiantes'"
              :path    = "'students_count'"
              @update:model-value="search_by_order"
            />
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Profesores'"
              :path    = "'teachers_count'"
              @update:model-value="search_by_order"
            />
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in data?.courses" :key="course.id">
            <td class="ellipsis">{{ course.name }}</td>
            <td class="ellipsis">{{ course.teachers_name.join(', ')}}</td>
            <td>{{ course.students_count }}</td>
            <td>{{ course.teachers_count }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/courses/${course.id}/users`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/courses/${course.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy.request(course.id)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <v-loader v-else />
    </div>
  </main>
</template>
