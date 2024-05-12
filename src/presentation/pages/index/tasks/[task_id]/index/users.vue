<script setup lang="ts">
import { user_request, user_task_request } from '~/src/config/repositories';
import { User } from '~/src/modules/user/domain/model';
import type { Task } from '~/src/modules/task/domain/model';
import { nano_id } from '~/elpandev/utils';
import { UserTask } from '~/src/modules/student_task/domain/model';
import { UserTaskFilter } from '~/src/modules/student_task/domain/filter';
import { UserFilter } from '~/src/modules/user/domain/filter';

const attrs      = useAttrs()
const task       = attrs.task as Task
const user_tasks = ref<UserTask[]>([])
const modal      = useModal()

async function request_users(): Promise<User[]> {
  return user_request.paginate(new UserFilter())
}

const { request: store } = useRequest(async (user: User) => {
  const user_task = new UserTask()

  user_task.user = user.copyWith()
  user_task.task = task.copyWith()

  await user_task_request.store(user_task)

  user_tasks.value.push(user_task)
})

const { request: destroy } = useRequest(async (user: User) => {
  await user_task_request.destroy(`${user.id}_${task.id}`)

  user_tasks.value.removeWhere(e => e.user.id == user.id)
})

const { request: request_user_tasks } = useRequest(async () => {
  user_tasks.value = await user_task_request.paginate(new UserTaskFilter({ task_id: task.id }))
})

const { pending } = await useLazyAsyncData(nano_id(), async () => {
  await request_user_tasks()
})
</script>

<template>
  <section class="task-users container">
    <header>
      <button @click="modal.open()">agregar</button>
    </header>
    <table class="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Contraseña</th>
          <th>Calificación</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user_task in user_tasks" :key="user_task.id">
          <td>{{ user_task.user.id }}</td>
          <td>{{ user_task.user.name }}</td>
          <td>{{ user_task.password }}</td>
          <td>{{ user_task.points.toFixed(2) }}</td>
          <td>{{ user_task.status }}</td>
          <td class="actions">
            <nuxt-link :to="`/tasks/${user_task.task.id}/questions?user_id=${user_task.user.id}`">ver</nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <Teleport to="body">
    <v-modal-models v-if="modal.enabled.value" :request="request_users()" @closed="modal.close()" >
      <template #body="{ models: users }">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>
                <v-icon-close v-if="user_tasks.some(e => e.user.id == user.id)" @click="destroy(user)" />
                <v-icon-add v-else @click="store(user)" />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </v-modal-models>
  </Teleport>
</template>
