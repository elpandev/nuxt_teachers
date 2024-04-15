<template>
  <button class="action download" @click="open()"><v-icon-download /> Reporte</button>

  <Teleport to="body">
    <v-modal v-if="enabled" @closed="close()">
      <form @submit.prevent="generate()">
        <v-loader v-if="pending" />
        <button v-else class="button outline text teal" type="submit">Generar Reporte</button>
      </form>
    </v-modal>
  </Teleport>
</template>

<script setup lang="ts">
import { AttendanceFactory } from '~/src/modules/attendance/domain/factory';
import { ReportTemplateAttendanceBasic } from '~/src/presentation/models/report_remplate/attendace/basic';

const { enabled, open, close } = useModal()

const { request: generate, pending } = useRequest(async () => {
  new ReportTemplateAttendanceBasic().download({
    name:             'Reporte de Asistencias',
    description:      'Reporte de asistenciasasdas',
    course_name:      'Química I',
    institution_name: 'Yachay Tech',
    student_name:     'Francisco Moncayo',
    attendances:      new AttendanceFactory().generate_multiple({ length: 4 }),
  })
})
</script>
