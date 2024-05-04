<template>
  <main v-if="!pending" class="document">
    <template v-if="data?.attendance">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/attendances/${data.attendance.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy" @click="destroy.request()"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ data.attendance.name }}</h1>
        <p>{{ data.attendance.description }}</p>
        <p>{{ data.attendance.course_name }}</p>
      </header>

      <div class="percents">
        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="present_names.length"
              :name="'Presente'"
              :amount="present_names.length"
              :total="users_length"
              :color="'red'"
            />
          </template>
        </v-message>

        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="late_names.length"
              :name="'Tarde'"
              :amount="late_names.length"
              :total="users_length"
              :color="'red'"
            />
          </template>
        </v-message>

        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="absent_names.length"
              :name="'Ausente'"
              :amount="absent_names.length"
              :total="users_length"
              :color="'red'"
            />
          </template>
        </v-message>

        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="expelled_names.length"
              :name="'Expulsado'"
              :amount="expelled_names.length"
              :total="users_length"
              :color="'red'"
            />
          </template>
        </v-message>
      </div>

      <section class="registers container">
        <header>
          <h3>Estudiantes</h3>
          <button class="button share" @click="show_attach_modal()"><v-icon-add /></button>
        </header>

        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Comentario</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user_attendance in data.user_attendances" :key="user_attendance.id">
              <td>
                <nuxt-link :to="`/students/${user_attendance.user_id}/attendances`" style="text-decoration: underline;">{{ user_attendance.user_name }}</nuxt-link>
              </td>
              <td>
                <select @input="on_select_status(user_attendance, ($event.target as any).value)">
                  <option
                    v-for="status in Object.values(UserAttendanceStatusEnum)"
                    :key="`${user_attendance.id}${status}`"
                    :value="status"
                    :selected="user_attendance.status == status"
                  >
                    {{ user_attendace_status_locale[status] }}
                  </option>
                </select>
              </td>
              <td>
                <textarea v-model="user_attendance.comment" rows="1" @focusout="on_focus_out_comment(user_attendance)"></textarea>
              </td>
              <td class="actions">
                <button @click="detach(user_attendance.user_id)"><v-icon-destroy /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
    <span v-else>Este registro de asistencias no existe</span>
  </main>
  <v-loader v-else />
  <Teleport :to="'#__nuxt'">
    <v-modal v-if="moda_enabled" class="user-attendance-attach-modal" @closed="moda_enabled = false">
      <ol>
        <li v-for="user in users" :key="`user-${user.id}`">
          <span class="role">{{ user_role_locale(user.role) }}</span>
          <span class="name">{{ user.name }}</span>

          <template v-if="is_attached(user)">
            <button class="detach" @click="detach(user.id)">
              <v-icon-close />
            </button>
          </template>
          
          <template v-else>
            <button class="attach" @click="attach(user)">
              <v-icon-add />
            </button>
          </template>
        </li>
      </ol>
    </v-modal>
  </Teleport>
</template>

<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { attendance_request, user_attendance_request, user_request } from '~/src/config/repositories';
import { AttendanceRegister, AttendanceRegisterStatusEnum, attendance_register_status_locale, attendance_register_status_options } from '~/src/modules/attendance/domain/values/register';
import { Student } from '~/src/modules/student/domain/model';
import { UserFilter } from '~/src/modules/user/domain/filter';
import { UserRoleEnum, user_role_locale, type User } from '~/src/modules/user/domain/model';
import { UserAttendanceFilter } from '~/src/modules/user_attendance/domain/filter';
import { UserAttendance, UserAttendanceStatusEnum, user_attendace_status_locale } from '~/src/modules/user_attendance/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar      = useSnackbar()
const route         = useRoute()
const attendance_id = route.params.attendance_id as string
const moda_enabled  = ref<boolean>(false)
const users         = ref<User[]>([])

function show_attach_modal() {
  request_users()

  moda_enabled.value = true
}

function is_attached(user: User): boolean {
  return data.value!.user_attendances.some(e => e.user_id == user.id)
}

function on_select_status(user_attendance: UserAttendance, status: UserAttendanceStatusEnum) {
  user_attendance.status = status

  update(user_attendance)
}

function on_focus_out_comment(user_attendance: UserAttendance) {
  update(user_attendance)
}

const { request: request_users } = useRequest(async () => {
  const filter = new UserFilter({
    order: { path: 'name', direction: OrderDirectionEnum.ASC },
    roles: [UserRoleEnum.STUDENT]
  })

  users.value =  await user_request.paginate(filter)
})

const { request: update } = useRequest(async (user_attendance: UserAttendance) => {
  await user_attendance_request.update(user_attendance.id, user_attendance.toPayload())
})

const { request: attach } = useRequest(async (user: User) => {
  const user_attendance = new UserAttendance({
    user_id:       user.id,
    user_name:     user.name,
    category_id:   data.value!.attendance!.category_id,
    category_name: data.value!.attendance!.category_name,
    course_id:     data.value!.attendance!.course_id,
    course_name:   data.value!.attendance!.course_name,
    attendance_id,
  })

  await user_attendance_request.store(user_attendance)

  data.value!.user_attendances.push(user_attendance)
  data.value!.user_attendances.sort((a, b) => a.user_name.localeCompare(b.user_name))

  data.value!.user_attendances = [...data.value!.user_attendances]
})

const { request: detach } = useRequest(async (user_id: string) => {
  const user_attendance = new UserAttendance({ user_id, attendance_id })

  await user_attendance_request.destroy(user_attendance.id)

  data.value!.user_attendances.removeWhere(e => e.user_id == user_id)

  data.value!.user_attendances = [...data.value!.user_attendances]
})

const destroy = useRequest(async () => {
  try {
    await attendance_request.destroy(data.value!.attendance!.id)

    data.value!.attendance = undefined

    snackbar.value.success(`La hoja de asistencias ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})

const users_length = computed<number>(() => {
  if (!data.value) return 0

  return data.value.user_attendances.length
})

const present_names = computed<string[]>(() => {
  if (!data.value) return []

  return data.value.user_attendances
    .filter(e => e.is_present)
    .map(e => e.user_name)
})

const late_names = computed<string[]>(() => {
  if (!data.value) return []

  return data.value.user_attendances
    .filter(e => e.is_late)
    .map(e => e.user_name)
})

const absent_names = computed<string[]>(() => {
  if (!data.value) return []

  return data.value.user_attendances
    .filter(e => e.is_absent)
    .map(e => e.user_name)
})

const expelled_names = computed<string[]>(() => {
  if (!data.value) return []

  return data.value.user_attendances
    .filter(e => e.is_expelled)
    .map(e => e.user_name)
})

const { data, pending } = await useLazyAsyncData(async () => {
  const [attendance, user_attendances] = await Promise.all([
    attendance_request.get(attendance_id),
    user_attendance_request.paginate(new UserAttendanceFilter({
      order: { path: 'user_name', direction: OrderDirectionEnum.ASC }
    }))
  ])

  return { attendance, user_attendances }
})
</script>

<style lang="scss">
.user-attendance-attach-modal {
  .container {
    padding: 18px;
    ol {
      display: grid;
      gap: 4px;
      li {
        display: grid;
        grid-template-columns: 128px 1fr auto;
        align-items: center;
        gap: 12px;
        button {
          background-color: #eee;
          border-radius: 4px;
          padding: 4px;
          transition: .1s;
          svg {
            fill: white;
            width: 18px;
            height: 18px;
          }
          &.attach {
            background-color: mediumseagreen;
          }
          &.detach {
            background-color: tomato;
          }
          &:focus {
            transform: scale(1.1, 1.1);
          }
        }
      }
    }
  }
}
</style>
