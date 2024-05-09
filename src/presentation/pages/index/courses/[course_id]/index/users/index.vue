<template>
  <button @click="show_attach_modal()">Agregar usuario</button>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Rol</th>
          <th>Nombre</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user_role_locale(user.role) }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td class="actions">
            <v-popup-menu>
              <nuxt-link :to="`/users/${user.id}`"><v-icon-visibility /> Ver</nuxt-link>
              <nuxt-link :to="`/users/${user.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
              <button @click="detach(user)"><v-icon-destroy /> Eliminar</button>
            </v-popup-menu>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Teleport :to="'#__nuxt'">
    <v-modal v-if="modal_enabled" class="user-course-attach-modal" @closed="modal_enabled = false">
      <ol>
        <li v-for="user in modal_users" :key="`user-${user.id}`">
          <span class="role">{{ user_role_locale(user.role) }}</span>
          <span class="name">{{ user.name }}</span>

          <template v-if="is_attached(user)">
            <button class="detach" @click="detach(user)">
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
import { user_course_request, user_request } from '~/src/config/repositories';
import { UserFilter } from '~/src/modules/user/domain/filter';
import { User, UserRoleEnum, user_role_locale } from '~/src/modules/user/domain/model';
import { UserCourse } from '~/src/modules/user_course/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar    = useSnackbar()
const route       = useRoute()
const course_id   = route.params.course_id as string
const users       = ref<User[]>([])
const users_count = ref<number>(0)
const modal_users = ref<User[]>([])
const filter      = new UserFilter({ course_id, order: { path: 'name', direction: OrderDirectionEnum.ASC } })

const { enabled: modal_enabled } = useModal()

function show_attach_modal() {
  request_modal_users()

  modal_enabled.value = true
}

function is_attached(user: User): boolean {
  return users.value.some(e => e.id == user.id)
}

const { request: request_modal_users } = useRequest(async () => {
  const filter = new UserFilter({
    order: { path: 'name', direction: OrderDirectionEnum.ASC },
    roles: [UserRoleEnum.TEACHER, UserRoleEnum.STUDENT]
  })

  modal_users.value =  await user_request.paginate(filter)
})

const { request: attach } = useRequest(async (user: User) => {
  const user_course = new UserCourse({ user_id: user.id, course_id })

  await user_course_request.store(user_course)

  users.value = [...users.value, user]
})

const { request: detach } = useRequest(async (user: User) => {
  const user_course = new UserCourse({ user_id: user.id, course_id })

  await user_course_request.destroy(user_course.id)

  users.value.removeWhere(e => e.id == user.id)
  users.value = [...users.value]
})

const { request: request_users } = useRequest(async () => {
  users.value = await user_request.paginate(filter)
})

const { request: request_users_count } = useRequest(async () => {
  users_count.value = await user_request.count(filter) as number
})

await useLazyAsyncData(async () => {
  await Promise.all([
    request_users(),
    request_users_count(),
  ])
})
</script>

<style lang="scss">
.user-course-attach-modal {
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
