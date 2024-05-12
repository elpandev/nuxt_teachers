<template>
  <v-custom-header-primary :name="`Hojas de Asistencias (${attendances_count})`">
    <template #buttons>
      <nuxt-link to="/attendances/create" class="button solid text teal">Nueva</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main v-if="!pending" class="documents">
    <div class="actions">
      <v-custom-button-generate-report-attendances />
      <button class="action download"><v-icon-download /> Descagar</button>
      <button class="action search" :class="{ enabled: searcher_enabled }" @click="searcher_enabled = !searcher_enabled"><v-icon-search/></button>
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

    <template v-if="filter.enabled() && search_count > 0">
      <div class="attendances-statistics"> 
        <section class="container percents">
          <v-percent :class="`status-${AttendanceRegisterStatusEnum.PRESENT.toLowerCase()}`"  :name="'Presente'"  :value="status_count.PRESENT" :max="sum_status_count" :average="status_count.PRESENT/attendances_count" />
          <v-percent :class="`status-${AttendanceRegisterStatusEnum.LATE.toLowerCase()}`"     :name="'Tarde'"     :value="status_count.LATE"    :max="sum_status_count" :average="status_count.LATE/attendances_count" />
        </section>

        <section class="container percents">
          <v-percent :class="`status-${AttendanceRegisterStatusEnum.ABSENT.toLowerCase()}`"   :name="'Ausente'"   :value="status_count.ABSENT"   :max="sum_status_count" :average="status_count.ABSENT/attendances_count" />
          <v-percent :class="`status-${AttendanceRegisterStatusEnum.EXPELLED.toLowerCase()}`" :name="'Expulsado'" :value="status_count.EXPELLED" :max="sum_status_count" :average="status_count.EXPELLED/attendances_count" />
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
          <tr v-for="attendance in attendances" :key="attendance.id">
            <td>{{ new Date(attendance.date_at).toLocaleDateString('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</td>
            <td>{{ attendance.name }}</td>
            <td>{{ attendance.course_name }}</td>
            <td>{{ attendance.category_name }}</td>
            <td>{{ attendance.present_count }}</td>
            <td>{{ attendance.late_count }}</td>
            <td>{{ attendance.absent_count }}</td>
            <td>{{ attendance.expelled_count }}</td>
            <!-- <template v-if="user_selected">
              <td :class="`status-${attendance.registers[user_selected.id]?.status.toLowerCase()}`">{{ attendance_register_status_locale(attendance.registers[user_selected.id]?.status) }}</td>
            </template> -->
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/attendances/${attendance.id}`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/attendances/${attendance.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy(attendance.id)"><v-icon-destroy /> Eliminar</button>
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
import { category_request, course_request, attendance_request } from '~/src/config/repositories';
import { AttendanceFilter } from '~/src/modules/attendance/domain/filter';
import { Course } from '~/src/modules/course/domain/model';
import { CategoryTypeEnum, type Category } from '~/src/modules/category/domain/model';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { AttendanceRegisterStatusEnum } from '~/src/modules/attendance/domain/values/register';
import { SelectOption, select_option_null, select_option_undefined } from '~/src/presentation/models/select_option';
import type { User } from '~/src/modules/user/domain/model';
import { UserAttendanceStatusEnum } from '~/src/modules/user_attendance/domain/model';
import type { Attendance } from '~/src/modules/attendance/domain/model';

const snackbar          = useSnackbar()
const searcher_enabled  = ref<boolean>(false)
const course_selected   = ref<Course|null>()
const category_selected = ref<Category|null>()
const filter            = reactive(new AttendanceFilter({ order: { path: 'date_at', direction: OrderDirectionEnum.DESC } }))
const attendances       = ref<Attendance[]>([])
const attendances_count = ref<number>(0)

const status_count = ref<Record<UserAttendanceStatusEnum, number>>({
  [UserAttendanceStatusEnum.PRESENT]:  0,
  [UserAttendanceStatusEnum.LATE]:     0,
  [UserAttendanceStatusEnum.ABSENT]:   0,
  [UserAttendanceStatusEnum.EXPELLED]: 0,
})

const sum_status_count = computed<number>(() => Object.values(status_count.value).reduce((total, value) => total += value ,0))

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
    request_attendances(),
    request_count(),
    request_status_count(),
  ])
})

const { request: destroy } = useRequest(async (attendance_id: string) => {
  try {
    await attendance_request.destroy(attendance_id)

    attendances.value.removeWhere(attendance => attendance.id == attendance_id)

    snackbar.value.success(`La hoja de asistencia ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})

const { request: request_status_count } = useRequest(async () => {
  status_count.value = await attendance_request.count(new AttendanceFilter({
    course_id:   filter.course_id,
    category_id: filter.category_id,
    status: [UserAttendanceStatusEnum.PRESENT, UserAttendanceStatusEnum.LATE, UserAttendanceStatusEnum.ABSENT, UserAttendanceStatusEnum.EXPELLED]
  })) as any
})

const { request: request_attendances } = useRequest(async () => {
  attendances.value = await attendance_request.paginate(filter)
})

const { request: request_count } = useRequest(async () => {
  attendances_count.value = await attendance_request.count(new AttendanceFilter({
    course_id:   filter.course_id,
    category_id: filter.category_id,
  })) as any
})

const { pending } = await useLazyAsyncData(async () => {
  await Promise.all([
    request_attendances(),
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
.attendances-statistics {
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
