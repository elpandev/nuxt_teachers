<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { attendance_request } from '~/src/config/repositories';
import { AttendanceFilter } from '~/src/modules/attendance/domain/filter';
import type { Attendance } from '~/src/modules/attendance/domain/model';
import { useSnackbar } from '../../states/snackbar';

interface IProps {
  attendances: Attendance[]
}

const props = defineProps<IProps>()
const snackbar = useSnackbar()

const filter = reactive(new AttendanceFilter({
  order: {
    path: 'date_at',
    direction: OrderDirectionEnum.DESC,
  }
}))

const destroy = useRequest(async (attendance_id: string) => {
  try {
    await attendance_request.destroy(attendance_id)

    props.attendances.removeWhere(attendance => attendance.id == attendance_id)

    snackbar.value.success(`La hoja de asistencias ha sido eliminada`)
  }

  catch (error) {
    console.error(error)
  }
})
</script>

<template>
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
          :name = "'Curso'"
          :path = "'course_name'"
        />
        <v-th-orderable
          v-model= "filter.order"
          :name = "'Categoría'"
          :path = "'category_name'"
        />
        <v-th-orderable
          v-model= "filter.order"
          :name = "'Nombre'"
          :path = "'name'"
        />
        <v-message is="th">
          <template #message>Estudiantes que aún no han registrado la asistencia</template>
          <template #element>Pe</template>
        </v-message>
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
      <tr v-for="attendance in props.attendances" :key="attendance.id">
        <td>{{ new Date(attendance.date_at).toLocaleDateString('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</td>
        <td>{{ attendance.course?.name }}</td>
        <td>{{ attendance.category?.name }}</td>
        <td>{{ attendance.name }}</td>
        <template v-for="(names, i) in attendance.registers_names" :key="`${attendance.id}names${i}`">
          <v-message v-if="names.length > 0" :is="'td'">
            <template #message>{{ names.join(', ') }}</template>
            <template #element>{{ names.length }}</template>
          </v-message>
          <td v-else>{{ names.length }}</td>
        </template>
        <td class="actions">
          <v-popup-menu>
            <nuxt-link :to="`/attendances/${attendance.id}`"><v-icon-visibility /> Ver</nuxt-link>
            <nuxt-link :to="`/attendances/${attendance.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
            <button @click="destroy.request(attendance.id)"><v-icon-destroy /> Eliminar</button>
          </v-popup-menu>
        </td>
      </tr>
    </tbody>
  </table>
</template>
