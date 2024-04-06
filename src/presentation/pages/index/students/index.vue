<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { course_request, student_request } from '~/src/config/repositories';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { StudentFilter } from '~/src/modules/student/domain/filter';
import { TableEnum } from '~/src/presentation/enums/tables';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar       = useSnackbar()
const filter         = reactive(new StudentFilter({ order: { path: 'name', direction: OrderDirectionEnum.ASC } }))
const filter_enabled = ref<boolean>(false)

const destroy = useRequest(async (student_id: string) => {
  try {
    await student_request.destroy(student_id)

    data.value?.students.removeWhere(student => student.id == student_id)

    snackbar.value.success(`El estudiante ha sido eliminado`)
  }

  catch (error) {
    console.error(error)
  }
})

async function request_data() {
  filter.course_id = undefined

  if (filter.course_name?.isNotEmpty()) {
    const courses = await course_request.paginate(new CourseFilter({ name: filter.course_name }))

    if (courses.isNotEmpty()) {
      filter.course_id = courses[0].id
    }
  }

  const [students, count] = await Promise.all([
    student_request.paginate(filter),
    student_request.count   (filter),
  ])

  return { students, count }
}

async function search_by_input() {
  filter.order = filter.enabled
    ? undefined
    : { path: 'name', direction: OrderDirectionEnum.ASC }

  data.value = await Promise.debounce(request_data, 1500, TableEnum.STUDENTS)
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
  <v-custom-header-primary :name="`Estudiantes (${ data?.count })`">
    <template #buttons>
      <nuxt-link to="students/create" class="button solid text teal">Nuevo Estudiante</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main class="documents">
    <div class="buttons">
      <button class="button filter"   :class="{ enabled: filter.enabled }" @click="filter_enabled = !filter_enabled"><v-icon-filter /> Filtrar</button>
      <button class="button download" :class="{ enabled: filter.enabled }"><v-icon-download /> Exportar</button>
      <button class="button download" :class="{ enabled: filter.enabled }"><v-icon-download /> Importar</button>
    </div>

    <template v-if="filter_enabled">
      <div class="container filters">
        <v-input
          v-model="filter.name"
          :type="'text'"
          :label="'Nombre'"
          :placeholder="'nombre...'"
          @update:model-value="search_by_input()"
        />
        
        <v-input
          v-model="filter.email"
          :type="'text'"
          :label="'Email'"
          :placeholder="'email...'"
          @update:model-value="search_by_input()"
        />
        
        <v-input
          v-model.number="filter.courses_count"
          :type="'number'"
          :label="'Cursos (Cantidad)'"
          :placeholder="'cantidad de cursos...'"
          @update:model-value="search_by_input()"
        />
        
        <v-input
          v-model="filter.course_name"
          :type="'text'"
          :label="'Curso'"
          :placeholder="'curso...'"
          @update:model-value="search_by_input()"
        />
      </div>
    </template>

    <div class="container">
      <table v-if="!pending" class="table">
        <thead>
          <tr>
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Nombre'"
              :path    = "'name'"
              @update:model-value="search_by_order"
            />
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Email'"
              :path    = "'email'"
              @update:model-value="search_by_order"
            />
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Cursos'"
              :path    = "'courses_count'"
              @update:model-value="search_by_order"
            />
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in data?.students" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.courses_count }} {{ student.courses_names.join(', ') }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/students/${student.id}`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/students/${student.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy.request(student.id)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <v-loader v-else />
    </div>
  </main>
</template>
