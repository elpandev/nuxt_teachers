<template>
  <main v-if="!pending" class="document">
    <template v-if="data?.grade">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/grades/${data.grade.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy" @click="destroy()"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ data.grade.name }}</h1>
        <p>{{ data.grade.description }}</p>
        <p>{{ data.grade.course_name }}</p>
      </header>

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
            <tr v-for="user_grade in data.user_grades" :key="user_grade.id">
              <td>
                <nuxt-link :to="`/students/${user_grade.user_id}/grades`" style="text-decoration: underline;">{{ user_grade.user_name }}</nuxt-link>
              </td>
              <td>
                <input v-model="user_grade.score" @focusout="on_focus_out_score(user_grade)" />
              </td>
              <td>
                <textarea v-model="user_grade.comment" rows="1" @focusout="on_focus_out_comment(user_grade)"></textarea>
              </td>
              <td class="actions">
                <button @click="detach(user_grade.user_id)"><v-icon-destroy /></button>
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
    <v-modal v-if="moda_enabled" class="user-grade-attach-modal" @closed="moda_enabled = false">
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
import { grade_request, user_grade_request, user_request } from '~/src/config/repositories';
import { UserFilter } from '~/src/modules/user/domain/filter';
import { UserRoleEnum, user_role_locale, type User } from '~/src/modules/user/domain/model';
import { UserGradeFilter } from '~/src/modules/user_grade/domain/filter';
import { UserGrade } from '~/src/modules/user_grade/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar      = useSnackbar()
const route         = useRoute()
const grade_id = route.params.grade_id as string
const moda_enabled  = ref<boolean>(false)
const users         = ref<User[]>([])

function show_attach_modal() {
  request_users()

  moda_enabled.value = true
}

function is_attached(user: User): boolean {
  return data.value!.user_grades.some(e => e.user_id == user.id)
}

function on_focus_out_score(user_grade: UserGrade) {
  update(user_grade)
}

function on_focus_out_comment(user_grade: UserGrade) {
  update(user_grade)
}

const { request: request_users } = useRequest(async () => {
  const filter = new UserFilter({
    order: { path: 'name', direction: OrderDirectionEnum.ASC },
    roles: [UserRoleEnum.STUDENT]
  })

  users.value =  await user_request.paginate(filter)
})

const { request: update } = useRequest(async (user_grade: UserGrade) => {
  await user_grade_request.update(user_grade.id, user_grade.toPayload())
})

const { request: attach } = useRequest(async (user: User) => {
  const user_grade = new UserGrade({
    user_id:       user.id,
    user_name:     user.name,
    category_id:   data.value!.grade!.category_id,
    category_name: data.value!.grade!.category_name,
    course_id:     data.value!.grade!.course_id,
    course_name:   data.value!.grade!.course_name,
    grade_id,
  })

  await user_grade_request.store(user_grade)

  data.value!.user_grades.push(user_grade)
  data.value!.user_grades.sort((a, b) => a.user_name.localeCompare(b.user_name))

  data.value!.user_grades = [...data.value!.user_grades]
})

const { request: detach } = useRequest(async (user_id: string) => {
  const user_grade = new UserGrade({ user_id, grade_id })

  await user_grade_request.destroy(user_grade.id)

  data.value!.user_grades.removeWhere(e => e.user_id == user_id)

  data.value!.user_grades = [...data.value!.user_grades]
})

const { request: destroy } = useRequest(async () => {
  try {
    await grade_request.destroy(data.value!.grade!.id)

    data.value!.grade = undefined

    snackbar.value.success(`La hoja de asistencias ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})

const users_length = computed<number>(() => {
  if (!data.value) return 0

  return data.value.user_grades.length
})

const { data, pending } = await useLazyAsyncData(async () => {
  const [grade, user_grades] = await Promise.all([
    grade_request.get(grade_id),
    user_grade_request.paginate(new UserGradeFilter({
      grade_id,
      order: { path: 'user_name', direction: OrderDirectionEnum.ASC }
    }))
  ])

  return { grade, user_grades }
})
</script>

<style lang="scss">
.user-grade-attach-modal {
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
