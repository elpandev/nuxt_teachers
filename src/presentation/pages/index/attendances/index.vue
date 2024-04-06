<script setup lang="ts">
import { category_request, course_request, attendance_request } from '~/src/config/repositories';
import { AttendanceFilter } from '~/src/modules/attendance/domain/filter';
import type { Student } from '~/src/modules/student/domain/model';
import { Course } from '~/src/modules/course/domain/model';
import { CategoryTypeEnum, type Category } from '~/src/modules/category/domain/model';
import type { ISelectOption } from '~/src/presentation/interfaces/select_option';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { AttendanceRegisterStatusEnum, attendance_register_status_locale } from '~/src/modules/attendance/domain/values/register';

const snackbar          = useSnackbar()
const name_selected     = ref<string>('')
const course_selected   = ref<Course|null>()
const student_selected  = ref<Student>()
const category_selected = ref<Category|null>()
const filter            = reactive(new AttendanceFilter({ order: { path: 'date_at', direction: OrderDirectionEnum.DESC } }))
const searcher_enabled  = ref<boolean>(false)

const present_count  = ref<number>(0)
const late_count     = ref<number>(0)
const absent_count   = ref<number>(0)
const expelled_count = ref<number>(0)

const present_average  = ref<number>(0)
const late_average     = ref<number>(0)
const absent_average   = ref<number>(0)
const expelled_average = ref<number>(0)

const students = computed<Student[]>(() => {
  const elements = Object.values(course_selected.value?.students ?? {})

  elements.sort((a, b) => a.name.localeCompare(b.name))

  return elements
})

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
    type: CategoryTypeEnum.ATTENDANCE,
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

const request_average = useRequest(async () => {
  const course   = course_selected  .value === null ? null : course_selected  .value
  const category = category_selected.value === null ? null : category_selected.value

  const filter = new AttendanceFilter({ course, category })

  await Promise.all([
    attendance_request
      .sum(`resume.status.${AttendanceRegisterStatusEnum.PRESENT}.count`, filter)
      .then(average => present_average.value = average),

    attendance_request
      .sum(`resume.status.${AttendanceRegisterStatusEnum.LATE}.count`, filter)
      .then(average => late_average.value = average),

    attendance_request
      .sum(`resume.status.${AttendanceRegisterStatusEnum.ABSENT}.count`, filter)
      .then(average => absent_average.value = average),

    attendance_request
      .sum(`resume.status.${AttendanceRegisterStatusEnum.EXPELLED}.count`, filter)
      .then(average => expelled_average.value = average),
  ])
})

const request_student_average = useRequest(async (student?: Student) => {
  student_selected.value = student

  const course   = course_selected  .value === null ? null : course_selected  .value
  const category = category_selected.value === null ? null : category_selected.value

  await Promise.all([
    attendance_request
      .count(new AttendanceFilter({ course, category, student, student_status: AttendanceRegisterStatusEnum.PRESENT }))
      .then(count => present_count.value = count),

    attendance_request
      .count(new AttendanceFilter({ course, category, student, student_status: AttendanceRegisterStatusEnum.LATE }))
      .then(count => late_count.value = count),

    attendance_request
      .count(new AttendanceFilter({ course, category, student, student_status: AttendanceRegisterStatusEnum.ABSENT }))
      .then(count => absent_count.value = count),

    attendance_request
      .count(new AttendanceFilter({ course, category, student, student_status: AttendanceRegisterStatusEnum.EXPELLED }))
      .then(count => expelled_count.value = count),
  ])
})

const search = useRequest(async () => {
  const course   = course_selected  .value === null ? null : course_selected  .value
  const category = category_selected.value === null ? null : category_selected.value

  filter.name     = name_selected.value
  filter.course   = course
  filter.category = category

  const [attendances, count] = await Promise.all([
    attendance_request.paginate(filter),
    attendance_request.count(filter),
    request_average.request(),
    request_student_average.request(student_selected.value ?? students.value[0]),
  ])

  data.value!.attendances = attendances
  data.value!.count  = count
})

const destroy = useRequest(async (attendance_id: string) => {
  try {
    await attendance_request.destroy(attendance_id)

    data.value?.attendances.removeWhere(attendance => attendance.id == attendance_id)

    snackbar.value.success(`La hoja de asistencia ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})

const { data, pending } = await useLazyAsyncData(async () => {
  const [attendances, count] = await Promise.all([
    attendance_request.paginate(filter),
    attendance_request.count(filter),
  ])

  return { attendances, count }
})

watch(searcher_enabled, (value) => {
  restart_name_selected()
  restart_course_selected()
  restart_category_selected()
})
</script>

<template>
  <v-custom-header-primary :name="`Hojas de Asistencias (${ data?.count ?? 0 })`">
    <template #buttons>
      <nuxt-link to="/attendances/create" class="button solid text teal">Nueva</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main v-if="!pending" class="documents">
    <template v-if="data">
      <div class="actions">
        <button class="action download"><v-icon-download /> Descagar</button>
        <button class="action search" :class="{ enabled: searcher_enabled }" @click="searcher_enabled = !searcher_enabled"><v-icon-search/></button>
      </div>

      <div v-if="searcher_enabled" class="container page-filter">
        <v-input v-model="name_selected" :placeholder="'Nombre'" />

        <button class="button solid text teal" @click="search.request()">Buscar</button>
      </div>

      <div v-if="!searcher_enabled" class="container page-filter">
        <v-selector
          :model-value="course_selected?.toSelectOption() ?? { name: '', value: undefined }"
          :placeholder="'Curso'"
          :request="search_course"
          :restart="restart_course_selected"
          @update:model-value="(value) => course_selected = value"
        />

        <v-selector
          :model-value="category_selected?.toSelectOption() ?? { name: '', value: undefined }"
          :placeholder="'Categoría'"
          :request="search_category"
          :restart="restart_category_selected"
          @update:model-value="(value) => category_selected = value"
        />

        <button class="button solid text teal" @click="search.request()">Filtrar</button>
      </div>

      <template v-if="filter.course && course_selected && filter.course.id == course_selected.id">
        <div class="attendances-statistics">
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
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.PRESENT.toLowerCase()}`"  :name="'Presente'"  :value="present_count"  :max="data.count" :average="present_average/students.length" />
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.LATE.toLowerCase()}`"     :name="'Tarde'"     :value="late_count"     :max="data.count" :average="late_average/students.length" />
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.ABSENT.toLowerCase()}`"   :name="'Ausente'"   :value="absent_count"   :max="data.count" :average="absent_average/students.length" />
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.EXPELLED.toLowerCase()}`" :name="'Expulsado'" :value="expelled_count" :max="data.count" :average="expelled_average/students.length" />
          </section>
        </div>
      </template>

      <section class="container attendances-table">
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
              <template v-if="student_selected">
                <th>Estado</th>
              </template>
              <v-message is="th">
                <template #message>Estudiantes que han asistido</template>
                <template #element>Pr</template>
              </v-message>
              <v-message is="th">
                <template #message>Estudiantes que han llegado tarde</template>
                <template #element>T</template>
              </v-message>
              <v-message is="th">
                <template #message>Estudiantes que no han asistido</template>
                <template #element>N</template>
              </v-message>
              <v-message is="th">
                <template #message>Estudiantes que han sido expulsados</template>
                <template #element>E</template>
              </v-message>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attendance in data?.attendances" :key="attendance.id">
              <td>{{ new Date(attendance.date_at).toLocaleDateString('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</td>
              <td>{{ attendance.name }}</td>
              <td>{{ attendance.course?.name }}</td>
              <td>{{ attendance.category?.name }}</td>
              <template v-if="student_selected">
                <td :class="`status-${attendance.registers[student_selected.id]?.status.toLowerCase()}`">{{ attendance_register_status_locale(attendance.registers[student_selected.id]?.status) }}</td>
              </template>
              <template v-for="(names, i) in attendance.registers_names" :key="`${attendance.id}names${i}`">
                <v-message v-if="names.length > 0" :is="'td'">
                  <template #message>{{ names.join(', ') }}</template>
                  <template #element>{{ names.length }}</template>
                </v-message>
                <td v-else>{{ names.length }}</td>
              </template>
              <td class="actions">
                <v-popup-menu>
                  <nuxt-link :to="`/attendances/${attendance.id}`"><v-icon-visibility /> Ver</nuxt-link>
                  <nuxt-link :to="`/attendances/${attendance.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                  <button @click="destroy.request(attendance.id)"><v-icon-destroy /> Eliminar</button>
                </v-popup-menu>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </main>
  <v-loader v-else />
</template>

<style lang="scss">
.attendances-statistics {
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
.attendances-table {
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
