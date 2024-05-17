<template>
  <v-custom-header-primary :name="`Hojas de Asistencias (${grades_count})`">
    <template #buttons>
      <nuxt-link to="/grades/create" class="button solid text teal">Nueva</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main v-if="!pending" class="documents">
    <div class="actions">
      <div>
        <button class="action download"><v-icon-download /> Descagar</button>
        <button class="action search" :class="{ enabled: searcher_enabled }" @click="searcher_enabled = !searcher_enabled"><v-icon-search/></button>
      </div>
    </div>

    <div v-if="searcher_enabled" class="container page-filter">
      <v-input v-model="filter.name" :placeholder="'Nombre'" />

      <button class="button solid text teal" @click="search()">Buscar</button>
    </div>

    <div v-if="!searcher_enabled" class="container page-filter">
      <v-selector
        v-model="course_option"
        :placeholder="'Curso'"
        :request="search_course"
        :restart="restart_course_selected"
      />

      <v-selector
        v-model="category_option"
        :placeholder="'Categoría'"
        :request="search_category"
        :restart="restart_category_selected"
      />

      <button class="button solid text teal" @click="search()">Filtrar</button>
    </div>

    <section class="container grades-table">
      <table class="table">
        <thead>
          <tr>
            <v-th-orderable
              v-model= "filter.order"
              :name = "'Fecha'"
              :path = "'date_at'"
            />
            <v-th-orderable
              v-model= "filter.order"
              :name = "'Nombre'"
              :path = "'name'"
            />
            <v-th-orderable
              v-model= "filter.order"
              :name = "'Curso'"
              :path = "'course_name'"
            />
            <v-th-orderable
              v-model= "filter.order"
              :name = "'Categoría'"
              :path = "'category_name'"
            />
            <th>Promedio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="grade in grades" :key="grade.id">
            <td>{{ grade.date_at.toLocaleDateString('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</td>
            <td>{{ grade.name }}</td>
            <td>{{ grade.course_name }}</td>
            <td>{{ grade.category_name }}</td>
            <td>{{ grade.users_average }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/grades/${grade.id}`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/grades/${grade.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy(grade.id)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
  <v-loader v-else />
</template>

<script setup lang="ts">
import { category_request, course_request, grade_request } from '~/src/config/repositories';
import { GradeFilter } from '~/src/modules/grade/domain/filter';
import { Course } from '~/src/modules/course/domain/model';
import { CategoryTypeEnum, type Category } from '~/src/modules/category/domain/model';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { SelectOption, select_option_null, select_option_undefined } from '~/src/presentation/models/select_option';
import type { Grade } from '~/src/modules/grade/domain/model';

const snackbar          = useSnackbar()
const searcher_enabled  = ref<boolean>(false)
const course_selected   = ref<Course|null>()
const category_selected = ref<Category|null>()
const filter            = reactive(new GradeFilter({ order: { path: 'date_at', direction: OrderDirectionEnum.DESC } }))
const grades            = ref<Grade[]>([])
const grades_count      = ref<number>(0)

const course_option = computed<SelectOption<Course|null|undefined>>({
  get() {
    if (course_selected.value === undefined) return select_option_undefined
    if (course_selected.value === null)      return select_option_null

    return course_selected.value.toSelectOption()
  },
  set(option) {
    filter.course_id = option.value === null ? null : option.value?.id
    course_selected.value = option.value
  }
})

const category_option = computed<SelectOption<Category|null|undefined>>({
  get() {
    if (category_selected.value === undefined) return select_option_undefined
    if (category_selected.value === null)      return select_option_null

    return category_selected.value.toSelectOption()
  },
  set(option) {
    filter.category_id = option.value === null ? null : option.value?.id
    category_selected.value = option.value
  }
})

async function search_course(name: string): Promise<SelectOption<Course|null|undefined>[]> {
  const data = await course_request.paginate(new CourseFilter({
    name: name,
    order: {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }))

  return [
    select_option_undefined,
    select_option_null,
    ...data.map(e => e.toSelectOption()),
  ]
}

async function search_category(name: string): Promise<SelectOption<Category|null|undefined>[]> {
  const data = await category_request.paginate(new CategoryFilter({
    name: name,
    type: CategoryTypeEnum.ATTENDANCE,
    order: {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }))

  return [
    select_option_undefined,
    select_option_null,
    ...data.map(e => e.toSelectOption()),
  ]
}

function restart_name_selected() {
  filter.name = undefined
}

function restart_course_selected() {
  filter.course_id = undefined

  course_selected.value = undefined
  course_option  .value = select_option_undefined
}

function restart_category_selected() {
  filter.category_id = undefined

  category_selected.value = undefined
  category_option  .value = select_option_undefined
}

const { request: search, count: search_count } = useRequest(async () => {
  await Promise.all([
    request_grades(),
    request_count(),
  ])
})

const { request: destroy } = useRequest(async (grade_id: string) => {
  try {
    await grade_request.destroy(grade_id)

    grades.value.removeWhere(grade => grade.id == grade_id)

    snackbar.value.success(`La hoja de asistencia ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})

const { request: request_grades } = useRequest(async () => {
  grades.value = await grade_request.paginate(filter)
})

const { request: request_count } = useRequest(async () => {
  grades_count.value = await grade_request.count(new GradeFilter({
    course_id:   filter.course_id,
    category_id: filter.category_id,
  })) as any
})

const { pending } = await useLazyAsyncData(async () => {
  await Promise.all([
    request_grades(),
    request_count(),
  ])
})

watch(searcher_enabled, (value) => {
  restart_name_selected()
  restart_course_selected()
  restart_category_selected()
})
</script>

<style lang="scss">
.grades-statistics {
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  gap: 18px;
  > .container {
    display: grid;
    gap: 9px;
    &.users {
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
.grades-table {
  td {
    &.status-present {
      color: $color_status_present;
    }
    &.status-late {
      color: $color_status_late;
    }
    &.status-absent {
      color: $color_status_absent;
    }
    &.status-expelled {
      color: $color_status_expelled;
    }
  }
}
</style>
