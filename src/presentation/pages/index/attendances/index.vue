<template>
  <v-custom-header-primary :name="`Hojas de Asistencias`">
    <template #buttons>
      <nuxt-link to="/attendances/create" class="button solid text teal">Nueva</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main v-if="!pending" class="documents">
    <template v-if="data">
      <div class="actions">
        <v-custom-button-generate-report-attendances />
        <button class="action download"><v-icon-download /> Descagar</button>
        <button class="action search" :class="{ enabled: searcher_enabled }" @click="searcher_enabled = !searcher_enabled"><v-icon-search/></button>
      </div>

      <div v-if="searcher_enabled" class="container page-filter">
        <v-input v-model="name_selected" :placeholder="'Nombre'" />

        <button class="button solid text teal" @click="search()">Buscar</button>
      </div>

      <div v-if="!searcher_enabled" class="container page-filter">
        <v-selector
          v-model="course_option"
          :placeholder="'Curso'"
          :request="search_course"
          :restart="restart_course"
        />

        <v-selector
          v-model="category_option"
          :placeholder="'Categoría'"
          :request="search_category"
          :restart="restart_category_selected"
        />

        <button class="button solid text teal" @click="search()">Filtrar</button>
      </div>

      <template v-if="filter.course_id !== undefined && user_selected !== undefined">
        <div class="attendances-statistics">
          <section class="container users">
            <ul>
              <template v-for="user in users" :key="user.id">
                <li @click="user_selected = user" :class="{ enabled: user_selected?.id == user.id }">
                  {{ user.name }}
                </li>
              </template>
            </ul>
          </section>
  
          <section class="container percents">
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.PRESENT.toLowerCase()}`"  :name="'Presente'"  :value="user_selected!.present_count"  :max="course_selected!.attendances_count" :average="course_selected!.present_count/users.length" />
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.LATE.toLowerCase()}`"     :name="'Tarde'"     :value="user_selected!.late_count"     :max="course_selected!.attendances_count" :average="course_selected!.late_count/users.length" />
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.ABSENT.toLowerCase()}`"   :name="'Ausente'"   :value="user_selected!.absent_count"   :max="course_selected!.attendances_count" :average="course_selected!.absent_count/users.length" />
            <v-percent :class="`status-${AttendanceRegisterStatusEnum.EXPELLED.toLowerCase()}`" :name="'Expulsado'" :value="user_selected!.expelled_count" :max="course_selected!.attendances_count" :average="course_selected!.expelled_count/users.length" />
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
              <template v-if="user_selected">
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
    </template>
  </main>
  <v-loader v-else />
</template>

<script setup lang="ts">
import { category_request, course_request, attendance_request, user_request } from '~/src/config/repositories';
import { AttendanceFilter } from '~/src/modules/attendance/domain/filter';
import { Course } from '~/src/modules/course/domain/model';
import { CategoryTypeEnum, type Category } from '~/src/modules/category/domain/model';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { AttendanceRegisterStatusEnum, attendance_register_status_locale } from '~/src/modules/attendance/domain/values/register';
import { SelectOption, select_option_null, select_option_undefined } from '~/src/presentation/models/select_option';
import type { IUser, User } from '~/src/modules/user/domain/model';
import { UserFilter } from '~/src/modules/user/domain/filter';

const snackbar          = useSnackbar()
const name_selected     = ref<string>('')
const course_selected   = ref<Course|null>()
const user_selected     = ref<User>()
const category_selected = ref<Category|null>()
const filter            = reactive(new AttendanceFilter({ order: { path: 'date_at', direction: OrderDirectionEnum.DESC } }))
const searcher_enabled  = ref<boolean>(false)
const users             = ref<User[]>([])

const course_option = computed<SelectOption<Course|null|undefined>>({
  get() {
    if (course_selected.value === undefined) return select_option_undefined
    if (course_selected.value === null)      return select_option_null

    return course_selected.value?.toSelectOption()
  },
  set(option) {
    filter.course_id = option.value?.id
    course_selected.value = option.value
  }
})

const category_option = computed<SelectOption<Category|null|undefined>>({
  get() {
    if (category_selected.value === undefined) return select_option_undefined
    if (category_selected.value === null)      return select_option_null

    return category_selected.value?.toSelectOption()
  },
  set(option) {
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
  name_selected.value = ''
}

function restart_course() {
  course_selected .value = undefined
  user_selected.value = undefined
  course_option.value = new SelectOption({ id: 'undefined', name: '', value: undefined })
}

function restart_category_selected() {
  category_selected .value = undefined
}

const { request: search } = useRequest(async () => {
  const [attendances] = await Promise.all([
    attendance_request.paginate(filter),
    request_users(),
  ])

  data.value!.attendances = attendances
})

const { request: destroy } = useRequest(async (attendance_id: string) => {
  try {
    await attendance_request.destroy(attendance_id)

    data.value?.attendances.removeWhere(attendance => attendance.id == attendance_id)

    snackbar.value.success(`La hoja de asistencia ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})

const { request: request_users } = useRequest(async () => {
  users.value = await user_request.paginate(new UserFilter({
    course_id: course_selected.value?.id
  }))

  user_selected.value = users.value[0]
})

const { data, pending } = await useLazyAsyncData(async () => {
  const [attendances] = await Promise.all([
    attendance_request.paginate(filter),
  ])

  return { attendances }
})

watch(searcher_enabled, (value) => {
  restart_name_selected()
  restart_course()
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
    height: 200px;
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
