<template>
  <v-custom-header-primary :name="`Inicio`" />

  <main style="display: grid; gap: 18px;">
    <ul class="counters" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(196px, 1fr)); gap: 12px;">
      <li class="container">
        <v-icon-add />
        <span>Estudiantes</span>
        <span>198</span>
      </li>
      <li class="container">
        <v-icon-bookmark />
        <span>Aulas</span>
        <span>25</span>
      </li>
      <li class="container">
        <v-icon-schedule />
        <span>Categorías</span>
        <span>7</span>
      </li>
    </ul>

    <section style="display: grid; gap: 12px;">
      <h3>Próximos Eventos</h3>

      <ul class="events">
        <li class="container" v-for="event in new EventFactory().generate_multiple({ length: 3 })" :key="event.id">
          <v-event :event="event" />
        </li>
      </ul>
    </section>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 21px;">
      <section style="display: grid; gap: 12px; align-content: start;">
        <h3>Últimos Exámenes</h3>

        <ul class="container student-tasks">
          <li v-for="student_task in student_tasks" :key="student_task.id">
            <span>{{ student_task.task.name }}</span>
            <span>{{ student_task.start_at ? new Date(student_task.start_at).format('YYYY-MM-DD') : '' }}</span>
            <span>{{ student_task.student.name }}</span>
            <span>{{ student_task.points }}</span>
          </li>
        </ul>
      </section>

      <section style="display: grid; gap: 12px; align-content: start;">
        <h3>Últimas Asistencias</h3>

        <ul class="container attendances">
          <li v-for="attendance in attendances" :key="attendance.id">
            <span>{{ new Date(attendance.date_at).format('YYYY/MM/DD') }}</span>
            <span>{{ attendance.name }}</span>
            <v-message :is="'span'">
              <template #element>78%</template>
              <template #message>7/12 estudiantes han asistido</template>
            </v-message>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { AttendanceFactory } from '~/src/modules/attendance/domain/factory';
import { AttendanceRegister } from '~/src/modules/attendance/domain/values/register';
import { EventFactory } from '~/src/modules/event/domain/factory';
import { StudentFactory } from '~/src/modules/student/domain/factory';
import { StudentTaskFactory } from '~/src/modules/student_task/domain/factory';
import { TaskFactory } from '~/src/modules/task/domain/factory';

const student_tasks = new StudentTaskFactory()
  .generate_multiple({ length: 4 })
  .map(student_task => {
    student_task.student = new StudentFactory().generate()
    student_task.task = new TaskFactory().generate()

    return student_task
  })

const attendances = new AttendanceFactory()
  .generate_multiple({ length: 4 })


</script>

<style lang="scss">
.counters {
  li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
  }
}
.student-tasks {
  display: grid;
  gap: 9px;
  padding: 18px 21px !important;
  li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 3px 12px;
    span {
      &:nth-of-type(1) {
        font-size: 13px;
        color: #aaa;
        grid-column: 1/3;
      }
      &:nth-of-type(2) {
        display: grid;
        font-size: 13px;
        color: #aaa;
      }
      &:nth-of-type(4) {
        display: grid;
        place-items: center;
        border-radius: 4px;
        grid-column: 3;
        width: fit-content;
        justify-self: right;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }
}
.attendances {
  display: grid;
  gap: 9px;
  padding: 18px 21px !important;
  li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
    span {
      &:nth-of-type(1) {
        font-size: 14px;
        color: #aaa;
      }
    }
  }
}
.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  li {
    padding: 0;
  }
}
</style>
