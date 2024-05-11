<script setup lang="ts">
import { task_request } from '~/src/config/repositories';
import { TaskFilter } from '~/src/modules/task/domain/filter';
import { Task } from '~/src/modules/task/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar = useSnackbar()
const tasks    = ref<Task[]>([])
const count    = ref<number>(0)

const destroy = useRequest(async (task: Task) => {
  await task_request.destroy(task.id)

  tasks.value.removeWhere(e => e.id == task.id)
  tasks.value = [...tasks.value]

  snackbar.value.success('El exámen ha sido eliminado')
})

const { pending } = await useLazyAsyncData(async () => {
  const filter = new TaskFilter()

  const [_tasks, _count] = await Promise.all([
    task_request.paginate(filter),
    task_request.count   (filter),
  ])

  tasks.value = _tasks
  count.value = _count as number
})
</script>

<template>
  <v-custom-header-primary :name="`Exámenes (${ count })`">
    <template #buttons>
      <nuxt-link to="/tasks/create" class="button solid text teal">Nuevo Exámen</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main v-if="!pending" class="documents">
    <div class="container">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Activo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Finalización</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.name }}</td>
            <td>{{ task.enabled ? 'SI' : 'NO' }}</td>
            <td>{{ task.start_at && new Date(task.start_at).toLocaleString() }}</td>
            <td>{{ task.end_at   && new Date(task.end_at)  .toLocaleString() }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/tasks/${task.id}/students`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/tasks/${task.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy.request(task)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
  <v-loader v-else />
</template>
