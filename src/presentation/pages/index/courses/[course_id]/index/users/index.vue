<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { user_course_request, user_request } from '~/src/config/repositories';
import type { Course } from '~/src/modules/course/domain/model';
import { UserFilter } from '~/src/modules/user/domain/filter';
import { User, UserRoleEnum, user_role_locale } from '~/src/modules/user/domain/model';
import { UserCourseFilter } from '~/src/modules/user_course/domain/filter';
import { UserCourse } from '~/src/modules/user_course/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const attrs              = useAttrs()
const course             = attrs.course as Course
const user_courses       = ref<UserCourse[]>([])
const user_courses_count = ref<number>(0)
const modal_users        = ref<User[]>([])
const filter             = new UserCourseFilter({ course_id: course.id, order: { path: 'user_name', direction: OrderDirectionEnum.ASC } })

const { enabled: modal_enabled } = useModal()

function show_attach_modal() {
  request_modal_users()

  modal_enabled.value = true
}

function is_attached(user: User): boolean {
  return user_courses.value.some(e => e.user_id == user.id)
}

const { request: request_modal_users } = useRequest(async () => {
  const filter = new UserFilter({
    order: { path: 'name', direction: OrderDirectionEnum.ASC },
    roles: [UserRoleEnum.TEACHER, UserRoleEnum.STUDENT]
  })

  modal_users.value =  await user_request.paginate(filter)
})

const { request: store } = useRequest(async (user: User) => {
  const user_course = new UserCourse().fromUser(user).fromCourse(course)

  await user_course_request.store(user_course)

  user_courses.value = [...user_courses.value, user_course]
})

const { request: destroy } = useRequest(async (user_course_id: string) => {
  await user_course_request.destroy(user_course_id)

  user_courses.value.removeWhere(e => e.id == user_course_id)
  user_courses.value = [...user_courses.value]
})

const { request: request_user_courses } = useRequest(async () => {
  user_courses.value = await user_course_request.paginate(filter)
})

const { request: request_user_courses_count } = useRequest(async () => {
  user_courses_count.value = await user_course_request.count(filter) as number
})

await useLazyAsyncData(async () => {
  await Promise.all([
    request_user_courses(),
    request_user_courses_count(),
  ])
})
</script>

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
        <tr v-for="user_course in user_courses" :key="user_course.id">
          <td>{{ user_course.id }}</td>
          <td>{{ user_role_locale(user_course.user_role) }}</td>
          <td>{{ user_course.user_name }}</td>
          <td>{{ user_course.user_email }}</td>
          <td class="actions">
            <v-popup-menu>
              <nuxt-link :to="`/users/${user_course.user_id}`"><v-icon-visibility /> Ver</nuxt-link>
              <nuxt-link :to="`/users/${user_course.user_id}/edit`"><v-icon-edit /> Editar</nuxt-link>
              <button @click="destroy(user_course.id)"><v-icon-destroy /> Eliminar</button>
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
            <button class="detach" @click="destroy(`${user.id}_${course.id}`)">
              <v-icon-close />
            </button>
          </template>
          
          <template v-else>
            <button class="attach" @click="store(user)">
              <v-icon-add />
            </button>
          </template>
        </li>
      </ol>
    </v-modal>
  </Teleport>
</template>

<style lang="scss">
.user-course-attach-modal {
  .container {
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
