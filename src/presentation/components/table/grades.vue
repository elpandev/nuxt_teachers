<script setup lang="ts">
import { category_request, course_request, grade_register_aggregate_request, grade_request } from '~/src/config/repositories';
import { GradeFilter } from '~/src/modules/grade/domain/filter';
import type { Student } from '~/src/modules/student/domain/model';
import { Course } from '~/src/modules/course/domain/model';
import { GradeRegisterAggregateFilter } from '~/src/modules/grade_register_aggregate/domain/filter';
import { CategoryTypeEnum, type Category } from '~/src/modules/category/domain/model';
import type { ISelectOption } from '~/src/presentation/interfaces/select_option';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { CourseFilter } from '~/src/modules/course/domain/filter';

const snackbar          = useSnackbar()
const name_selected     = ref<string>('')
const course_selected   = ref<Course>()
const student_selected  = ref<Student>()
const category_selected = ref<Category>()
const average           = ref<number>(0)
const student_average   = ref<number>(0)
const filter            = reactive(new GradeFilter({ order: { path: 'date_at', direction: OrderDirectionEnum.DESC } }))
const searcher_enabled  = ref<boolean>(false)

const students = computed<Student[]>(() => Object.values(course_selected.value?.students ?? {}))

async function search_course(name: string): Promise<ISelectOption<Course|null>[]> {
  const data = await course_request.paginate(new CourseFilter({
    name: name,
    order: {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }))

  return [
    { name: 'Ninguno', value: null },
    ...data.map(e => e.toSelectOption()),
  ]
}

async function search_category(name: string): Promise<ISelectOption<Category|null>[]> {
  const data = await category_request.paginate(new CategoryFilter({
    name: name,
    type: CategoryTypeEnum.GRADE,
    order: {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }))

  return [
    { name: 'Ninguna', value: null },
    ...data.map(e => e.toSelectOption()),
  ]
}

function restart_name_selected() {
  name_selected.value = ''
}

function restart_course_selected() {
  course_selected .value = undefined
  student_selected.value = undefined
}

function restart_category_selected() {
  category_selected .value = undefined
}

const request_student_average = useRequest(async (student?: Student) => {
  student_selected.value = student

  const course_id   = course_selected  .value === null ? null : course_selected  .value?.id
  const category_id = category_selected.value === null ? null : category_selected.value?.id
  const student_id  = student_selected .value?.id

  await Promise.all([
    grade_register_aggregate_request
      .average(`score`, new GradeRegisterAggregateFilter({ course_id, category_id, student_id }))
      .then(value => student_average.value = value),
  ])
})

const search = useRequest(async () => {
  const course   = course_selected  .value === null ? null : course_selected  .value
  const category = category_selected.value === null ? null : category_selected.value

  filter.name     = name_selected.value
  filter.course   = course
  filter.category = category

  async function request_average() {
    if (course || category) {
      average.value = await grade_request.average(`resume.average`, filter)
    }
  }

  const [grades] = await Promise.all([
    grade_request.paginate(filter),
    request_average(),
    request_student_average.request(student_selected.value ?? students.value[0]),
  ])

  data.value!.grades = grades
})

const destroy = useRequest(async (grade_id: string) => {
  try {
    await grade_request.destroy(grade_id)

    data.value?.grades.removeWhere(grade => grade.id == grade_id)

    snackbar.value.success(`La hoja de calificaciones ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})

const { data, pending } = await useLazyAsyncData(async () => {
  const [grades] = await Promise.all([
    grade_request.paginate(filter),
  ])

  return { grades }
})

watch(searcher_enabled, (value) => {
  restart_name_selected()
  restart_course_selected()
  restart_category_selected()
})
</script>

<template>
  <template v-if="!pending">
    <template v-if="data">
      <div class="actions">
        <button class="action download"><v-icon-download /> Descagar</button>
        <button class="action search" :class="{ enabled: searcher_enabled }" @click="searcher_enabled = !searcher_enabled"><v-icon-search/> Buscar</button>
      </div>

      <div v-if="searcher_enabled" class="container page-filter">
        <v-input v-model="name_selected" :placeholder="'Nombre'" />

        <button class="button solid text teal" @click="search.request()">Buscar</button>
      </div>

      <div v-if="!searcher_enabled" class="container page-filter">
        <v-selector v-model="course_selected"   :placeholder="'Curso'"     :request="search_course"   @restart="restart_course_selected()" />
        <v-selector v-model="category_selected" :placeholder="'Categoría'" :request="search_category" @restart="restart_category_selected()" />

        <button class="button solid text teal" @click="search.request()">Filtrar</button>
      </div>

      <template v-if="filter.course && course_selected && filter.course.id == course_selected.id">
        <div class="grades-statistics">
          <section class="container students">
            <ul>
              <template v-for="student in students" :key="student.id">
                <li @click="request_student_average.request(student)" :class="{ enabled: student_selected?.id == student.id }">
                  {{ student.name }}
                </li>
              </template>
            </ul>
          </section>
  
          <section class="container percents">
            <v-percent :name="'Calificación'" :value="student_average" :max="10" :average="average" :color="'#ffbbac'" :decimals="2" />
          </section>
        </div>
      </template>

      <section class="container">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Categoría</th>
              <th>Promedio</th>
              <template v-if="student_selected">
                <th>Calificación</th>
              </template>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grade in data.grades" :key="grade.id">
              <td>{{ new Date(grade.date_at).toLocaleDateString('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</td>
              <td>{{ grade.name }}</td>
              <td>{{ grade.course?.name }}</td>
              <td>{{ grade.category?.name }}</td>
              <td>{{ grade.registers_average.toFixed(2) }}</td>
              <template v-if="student_selected">
                <th>{{ grade.registers[student_selected.id]?.score }}</th>
              </template>
              <td class="actions">
                <v-popup-menu>
                  <nuxt-link :to="`/grades/${grade.id}`"><v-icon-visibility /> Ver</nuxt-link>
                  <nuxt-link :to="`/grades/${grade.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                  <button @click="destroy.request(grade.id)"><v-icon-destroy /> Eliminar</button>
                </v-popup-menu>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </template>
  <v-loader v-else />
</template>

<style lang="scss">
.grades-statistics {
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  gap: 18px;
  > .container {
    display: grid;
    gap: 9px;
    height: 200px;
    &.students {
      overflow-y: scroll;
      padding: 12px;
      ul {
        display: grid;
        gap: 9px;
        align-content: start;
        li {
          border: 1px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          padding: 6px 9px;
          background-color: #f7f7f7;
          &:hover, &.enabled {
            background-color: rgba($color_primary, 0.09);
            color: $color_primary;
          }
        }
      }
    }
    &.percents {
      padding: 24px;
      align-items: baseline;
    }
  }
}
</style>
