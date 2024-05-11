<script setup lang="ts">
import { student_request, task_request, student_task_request } from '~/src/config/repositories';
import { Student } from '~/src/modules/student/domain/model';
import type { Task } from '~/src/modules/task/domain/model';
import { StudentTask } from '~/src/modules/student_task/domain/model';
import { StudentTaskFilter } from '~/src/modules/student_task/domain/filter';
import { nano_id } from '~/elpandev/utils';

const attrs  = useAttrs()
const task   = attrs.task as Task
const modal  = useModal()

async function request_students() {
  return student_request.paginate()
}

const store = useRequest(async (student: Student) => {
  const student_task = new StudentTask()

  student_task.student = student.copyWith()
  student_task.task    = task.copyWith()

  await student_task_request.store(student_task)

  data.value?.student_tasks.push(student_task)
})

const destroy = useRequest(async (student: Student) => {
  await student_task_request.destroy(`${student.id}_${task.id}`)

  data.value?.student_tasks.removeWhere(e => e.student.id == student.id)
})

const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
  const [student_tasks] = await Promise.all([
    student_task_request.paginate(new StudentTaskFilter({ task_id: task.id }))
  ])

  return { student_tasks }
})
</script>

<template>
  <section v-if="data" class="task-students container">
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
        <tr v-for="student_task in data.student_tasks" :key="student_task.id">
          <td>{{ student_task.student.id }}</td>
          <td>{{ student_task.student.name }}</td>
          <td>{{ student_task.password }}</td>
          <td>{{ student_task.points.toFixed(2) }}</td>
          <td>{{ student_task.status }}</td>
          <td class="actions">
            <nuxt-link :to="`/tasks/${student_task.task.id}/questions?student_id=${student_task.student.id}`">ver</nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <Teleport to="body">
    <v-modal-models v-if="modal.enabled.value" :request="request_students()" @closed="modal.close()" >
      <template #body="{ models: students }">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>
                <v-icon-close v-if="data?.student_tasks.some(e => e.student.id == student.id)" @click="destroy.request(student)" />
                <v-icon-add v-else @click="store.request(student)" />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </v-modal-models>
  </Teleport>
</template>
