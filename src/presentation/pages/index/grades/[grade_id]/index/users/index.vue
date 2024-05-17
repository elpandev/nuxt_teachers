<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { user_grade_request, user_request } from '~/src/config/repositories';
import type { Grade } from '~/src/modules/grade/domain/model';
import { UserFilter } from '~/src/modules/user/domain/filter';
import { User, UserRoleEnum, user_role_locale } from '~/src/modules/user/domain/model';
import { UserGradeFilter } from '~/src/modules/user_grade/domain/filter';
import { UserGrade } from '~/src/modules/user_grade/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const attrs              = useAttrs()
const grade             = attrs.grade as Grade
const user_grades       = ref<UserGrade[]>([])
const user_grades_count = ref<number>(0)
const modal_users        = ref<User[]>([])
const filter             = new UserGradeFilter({ grade_id: grade.id, order: { path: 'user_name', direction: OrderDirectionEnum.ASC } })

const { enabled: modal_enabled } = useModal()

function show_attach_modal() {
  request_modal_users()

  modal_enabled.value = true
}

function is_attached(user: User): boolean {
  return user_grades.value.some(e => e.user_id == user.id)
}

function on_focus_out_score(user_grade: UserGrade) {
  update(user_grade)
}

function on_focus_out_comment(user_grade: UserGrade) {
  update(user_grade)
}

const { request: update } = useRequest(async (user_grade: UserGrade) => {
  await user_grade_request.update(user_grade.id, user_grade.toPayload())
})

const { request: store } = useRequest(async (user: User) => {
  const user_grade = new UserGrade().fromUser(user).fromGrade(grade)

  await user_grade_request.store(user_grade)

  user_grades.value = [...user_grades.value, user_grade]
})

const { request: destroy } = useRequest(async (user_grade_id: string) => {
  await user_grade_request.destroy(user_grade_id)

  user_grades.value.removeWhere(e => e.id == user_grade_id)
  user_grades.value = [...user_grades.value]
})

const { request: request_modal_users } = useRequest(async () => {
  const filter = new UserFilter({
    order: { path: 'name', direction: OrderDirectionEnum.ASC },
    roles: [UserRoleEnum.TEACHER, UserRoleEnum.STUDENT]
  })

  modal_users.value =  await user_request.paginate(filter)
})

const { request: request_user_grades } = useRequest(async () => {
  user_grades.value = await user_grade_request.paginate(filter)
})

const { request: request_user_grades_count } = useRequest(async () => {
  user_grades_count.value = await user_grade_request.count(filter) as number
})

await useLazyAsyncData(async () => {
  await Promise.all([
    request_user_grades(),
    request_user_grades_count(),
  ])
})
</script>

<template>
  <button @click="show_attach_modal()">Agregar usuario</button>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Calificación</th>
          <th>Comentario</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user_grade in user_grades" :key="user_grade.id">
          <td>{{ user_grade.user_name }}</td>
          <td>
            <input v-model="user_grade.score" @focusout="on_focus_out_score(user_grade)" />
          </td>
          <td>
            <textarea v-model="user_grade.comment" rows="1" @focusout="on_focus_out_comment(user_grade)"></textarea>
          </td>
          <td class="actions">
            <button @click="destroy(user_grade.id)"><v-icon-destroy /></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <Teleport :to="'#__nuxt'">
    <v-modal v-if="modal_enabled" class="user-grade-attach-modal" @closed="modal_enabled = false">
      <ol>
        <li v-for="user in modal_users" :key="`user-${user.id}`">
          <span class="role">{{ user_role_locale(user.role) }}</span>
          <span class="name">{{ user.name }}</span>

          <template v-if="is_attached(user)">
            <button class="detach" @click="destroy(`${user.id}_${grade.id}`)">
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
.user-grade-attach-modal {
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
