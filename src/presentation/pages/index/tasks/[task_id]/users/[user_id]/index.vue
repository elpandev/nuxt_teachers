<script setup lang="ts">
import { QuestionFactory } from '~/src/modules/question/domain/factory';
import type { Question } from '~/src/modules/question/domain/model';
import { TaskFactory } from '~/src/modules/task/domain/factory';
import { Task } from '~/src/modules/task/domain/model';
import { UserQuestionFactory } from '~/src/modules/user_question/domain/factory';
import { UserQuestion } from '~/src/modules/user_question/domain/model';
import { UserTaskFactory } from '~/src/modules/user_task/domain/factory';
import { UserTask } from '~/src/modules/user_task/domain/model';

const task           = ref<Task>(new Task())
const user_task      = ref<UserTask>(new UserTask())
const questions      = ref<Question[]>([])
const user_questions = ref<Record<string, UserQuestion>>({})

async function request_task() {
  task.value = new TaskFactory().generate()
}

async function request_user_task() {
  user_task.value = new UserTaskFactory().generate()

  user_task.value.exists = true
}

async function request_questions() {
  questions.value = new QuestionFactory()
    .generate_multiple({ length: 12 })
    .map(e => { e.exists = true; return e })
}

async function request_user_questions() {
  for (const question of questions.value) {
    if (Math.random() > 0.3) {
      const user_question = new UserQuestionFactory().generate()

      user_question.exists = true

      user_questions.value[question.id] = user_question
    }
  }
}

const { pending } = useLazyAsyncData(async () => {
  await Promise.all([
    request_task(),
    request_questions(),
    request_user_task(),
    request_user_questions(),
  ])
})
</script>

<template>
  <v-custom-header-primary :name="`${user_task.user_name}`">
    <template #buttons>
      <nuxt-link to="/tasks/create" class="button solid text teal">Nuevo Exámen</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main class="document user-task">
    <div class="buttons">
      <div>
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
      </div>
      <div>
        <button class="button destroy"><v-icon-destroy /> Eliminar</button>
      </div>
    </div>

    <header class="container">
      <h1>{{ task.name }}</h1>
    </header>

    <ul class="container">
      <li><b>Calficación:</b> {{ user_task.points }}</li>
      <li><b>Preguntas Respondidas:</b> {{ user_task.points }}</li>
      <li><b>Preguntas sin responder:</b> {{ user_task.points }}</li>
      <li><b>Estado:</b> {{ user_task.status }}</li>
      <li><b>Tiempo:</b> {{ user_task.time_expended.toFormat() }}</li>
    </ul>

    <v-user-question v-for="question in questions"
      :class="'container'"
      :key="question.id"
      :question="question"
      :user_question="user_questions[question.id]"
    />
  </main>
</template>

<style lang="scss">
.user-task {
  .user-question {
    display: grid;
    gap: 18px;
    .answer {
      color: $color_primary;
    }
    .comment {
      color: $color_red;
    }
  }
}
</style>
