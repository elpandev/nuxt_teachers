<script setup lang="ts">
import { question_request, task_request } from '~/src/config/repositories';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { Task } from '~/src/modules/task/domain/model';

const route   = useRoute()
const task_id = route.params.task_id as string
const task    = ref<Task>(new Task())

const { request: request_task } = useRequest(async () => {
  task.value = await task_request.get(task_id) ?? new Task()
})

const { data, pending } = await useLazyAsyncData(async () => {
  await request_task()
})
</script>

<template>
  <main v-if="!pending" class="document">
    <template v-if="task.exists">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/tasks/${task.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ task.name }}</h1>
        <p>{{ task.description }}</p>
      </header>

      <div class="information-statistic">
        <section class="information container">
          <header>
            <h3>Información</h3>
          </header>
          <ul>
            <li><b>Preguntas:</b> <span>{{ task.questions_count }}</span></li>
            <!-- <li><b>Puntos:</b> <span>{{ task.calculate_points(data.questions) }}</span></li> -->
          </ul>
        </section>

        <section class="statistic container">
          <header>
            <h3>Estadistica</h3>
          </header>
          <ul>
            <li>
              <span class="value">{{ 1 }}</span>
              <nuxt-link class="name" :to="`/tasks/${task.id}/responses`">Tareas Resueltas</nuxt-link>
            </li>
            <li>
              <span class="value">{{ 1 }}</span>
              <span class="name">Promedio</span>
            </li>
            <li>
              <span class="value">{{ 1 }}</span>
              <nuxt-link class="name" :to="`/tasks/${task.id}/responses/${1}`">Mejor Calificación</nuxt-link>
            </li>
            <li>
              <span class="value">{{ 1 }}</span>
              <nuxt-link class="name" :to="`/tasks/${task.id}/responses/${1}`">Peor Calificación</nuxt-link>
            </li>
          </ul>
          <footer>
            <span><nuxt-link :to="`/tasks/${task.id}/questions?user_id=${1}`">{{ 1 }}</nuxt-link> ha obtenido la mejor calificación</span>
          </footer>
        </section>
      </div>

      <nav class="container">
        <nuxt-link :to="`/tasks/${task_id}/students`">Estudiantes</nuxt-link>
        <nuxt-link :to="`/tasks/${task_id}/questions`">Preguntas</nuxt-link>
      </nav>

      <nuxt-page v-if="task.exists" :task="task" />
    </template>
    <span v-else>Esta Tarea no existe</span>
  </main>
  <v-loader v-else />
</template>

<style lang="scss">
  main.task {
    display: grid;
    gap: 18px;
    background-color: rgba(#eee, 0.3);
    > .buttons {
      display: flex;
      gap: 12px;
      .button {
        display: flex;
        gap: 9px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 1px 4px 0 #eee;
        padding: 9px 15px;
        font-size: 14px;
        transition: 0.2s;
        color: black;
        svg {
          width: 19px;
          height: 19px;
        }
        &.edit {
          margin-left: auto;
          svg {
            fill: $color_orange;
          }
        }
        &.destroy {
          svg {
            fill: $color_red;
          }
        }
        &.share {
          svg {
            fill: $color_primary;
          }
        }
        &.download {
          svg {
            fill: $color_green_teal;
          }
        }
        &.clone {
          svg {
            fill: $color_purple;
          }
        }
        &:hover {
          &.clone {
            box-shadow: 0 1px 4px 0 rgba($color_purple, 0.24);
            color: $color_purple;
          }
          &.destroy {
            box-shadow: 0 1px 4px 0 rgba($color_red, 0.24);
            color: $color_red;
          }
          &.share {
            box-shadow: 0 1px 4px 0 rgba($color_primary, 0.24);
            color: $color_primary;
          }
          &.download {
            box-shadow: 0 1px 4px 0 rgba($color_green_teal, 0.24);
            color: $color_green_teal;
          }
          &.edit {
            box-shadow: 0 1px 4px 0 rgba($color_orange, 0.24);
            color: $color_orange;
          }
        }
      }
    }
    > header {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 1px 4px 0 #eee;
      padding: 12px 18px;
      h1 {
        font-size: 21px;
      }
      p {
        font-size: 15px;
      }
    }
    > .information-statistic {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 18px;
    }
    section {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 1px 4px 0 #eee;
      padding: 15px 18px 18px 18px;
      > header {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: end;
        border-bottom: 1px solid #eee;
        padding-bottom: 12px;
        text-align: center;
        h3 {
          font-size: 15px;
          text-transform: uppercase;
        }
      }
      > footer {
        border-top: 1px solid #eee;
        padding-top: 12px;
        text-align: center;
        span {
          font-size: 14px;
          a {
            font-size: 14px;
            color: $color_primary;
          }
        }
      }
      &.information {
        display: grid;
        gap: 18px;
        align-content: start;
        > ul {
          display: grid;
          gap: 12px;
          li {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            background-color: rgba($color_primary, 0.04);
            border: 1px solid rgba($color_primary, 0.12);
            border-radius: 6px;
            padding: 9px 15px;
            b {
              font-size: 14px;
              font-weight: 500;
            }
            span {
              font-size: 14px;
              border-radius: 100%;
              color: $color_primary;
            }
          }
        }
      }
      &.statistic {
        display: grid;
        gap: 24px 0;
        align-content: space-between;
        > ul {
          display: grid;
          grid-template-columns: repeat(4, auto);
          gap: 24px;
          justify-content: center;
          li {
            display: grid;
            justify-items: center;
            gap: 12px;
            .value {
              display: grid;
              place-items: center;
              width: 64px;
              height: 64px;
              background-color: rgb(255, 225, 225);
              border-radius: 100%;
              font-size: 17px;
              color: red;
              font-weight: 500;
            }
            .name {
              font-size: 14px;
              text-align: center;
            }
            a.name {
              font-size: 14px;
              color: black;
              &:hover {
                color: $color_primary;
              }
            }
          }
        }
      }
      &.questions {
        display: grid;
        gap: 18px;
        .question {
          display: grid;
          gap: 18px;
          padding: 18px;
          background-color: rgba(#eee, 0.3);
          border-radius: 9px;
          > header {
            display: grid;
            gap: 6px;
            p {
              font-size: 14px;
            }
          }
          .options {
            display: grid;
            gap: 9px;
          }
        }
      }
    }
  }
</style>
