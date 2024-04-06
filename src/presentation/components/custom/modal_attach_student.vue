<script setup lang="ts">
  import { student_request } from '~/src/config/repositories';
  import { StudentFilter } from '~/src/modules/student/domain/filter';
  import { Student } from '~/src/modules/student/domain/model';

  interface IProps {
    filter?: StudentFilter
    students_attached: string[]
  }

  interface IEmits {
    (e: 'closed'): void
    (e: 'attach', student: Student): void
    (e: 'detach', student: Student): void
  }

  const props = defineProps<IProps>()
  const emit  = defineEmits<IEmits>()
  const students = ref<string[]>(props.students_attached)

  function attach(student: Student): void {
    students.value.unshift(student.id)
    students.value = [...students.value]

    emit('attach', student)
  }

  function detach(student: Student): void {
    students.value.removeWhere(e => e == student.id)
    students.value = [...students.value]

    emit('detach', student)
  }

  const { data, pending } = await useLazyAsyncData(async () => {
    const students = await student_request.paginate(props.filter)

    return { students }
  })
</script>

<template>
  <v-modal class="students" @closed="emit('closed')">
    <template v-if="data?.students">
      <div class="header">
  
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in data.students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td class="actions">
                <button class="button teal" v-if="!students.includes(student.id)" @click="attach(student)"><v-icon-add /></button>
                <button class="button teal" v-else @click="detach(student)" ><v-icon-close /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </v-modal>
</template>

<style lang="scss">
.modal.students {
  > .container {
    padding: 21px;
  }
}
</style>