<script setup lang="ts">
import { AttendanceFactory } from '~/src/modules/attendance/domain/factory';
import { AttendanceRegister } from '~/src/modules/attendance/domain/values/register';
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

    <section>
      <h3>Próximos eventos</h3>

      <ol>
        <li v-for="item in 3" :key="item">
          <span>{{ new Date().toString() }}</span>
          <span>Teatro de Roma</span>
          <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil vitae corrupti, temporibus inventore et ut nobis voluptas, id mollitia beatae recusandae deserunt. Eius, dolor.</span>
          
        </li>
      </ol>
    </section>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
      <section class="container" style="display: grid; gap: 12px; padding: 18px 21px; align-content: start;">
        <header>
          <h3>Últimos examenes</h3>
        </header>

        <ul class="student-tasks">
          <li v-for="student_task in student_tasks" :key="student_task.id">
            <span>{{ student_task.task.name }}</span>
            <span>{{ student_task.student.name }}</span>
            <span>{{ student_task.points }}</span>
          </li>
        </ul>
      </section>

      <section class="container" style="display: grid; gap: 12px; padding: 18px 21px; align-content: start;">
        <header>
          <h3>Últimas hojas de asistencia</h3>
        </header>

        <ul class="attendances">
          <li v-for="attendance in attendances" :key="attendance.id">
            <span>{{ new Date(attendance.date_at).toLocaleDateString() }}</span>
            <span>{{ attendance.name }}</span>
            <v-message :is="'span'">
              <template #element>78%</template>
              <template #message>7/12 estudiantes han asistido</template>
            </v-message>
          </li>
        </ul>
      </section>
    </div>

    <section class="container">
      <header>
        <h3>Últimos exámenes resueltos</h3>
      </header>
    </section>
  </main>
</template>

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
  li {
    display: grid;
    grid-template-columns: 1fr auto;
    span {
      &:first-of-type {
        font-size: 13px;
        color: #aaa;
        grid-column: 1/3;
      }
    }
  }
}
.attendances {
  display: grid;
  gap: 9px;
  li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
  }
}
</style>
