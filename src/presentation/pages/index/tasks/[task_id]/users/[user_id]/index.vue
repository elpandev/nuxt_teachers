<script setup lang="ts">
import { OptionFactory } from '~/src/modules/option/domain/factory';
import type { Option } from '~/src/modules/option/domain/model';
import { QuestionFactory } from '~/src/modules/question/domain/factory';
import type { Question } from '~/src/modules/question/domain/model';
import { TaskFactory } from '~/src/modules/task/domain/factory';
import { Task } from '~/src/modules/task/domain/model';
import { UserOptionFactory } from '~/src/modules/user_option/domain/factory';
import type { UserOption } from '~/src/modules/user_option/domain/model';
import { UserQuestionFactory } from '~/src/modules/user_question/domain/factory';
import { UserQuestion } from '~/src/modules/user_question/domain/model';
import { UserTaskFactory } from '~/src/modules/user_task/domain/factory';
import { UserTask } from '~/src/modules/user_task/domain/model';

const task           = ref<Task>(new Task())
const user_task      = ref<UserTask>(new UserTask())
const questions      = ref<Question[]>([])
const user_questions = ref<Record<string, UserQuestion>>({})
const options        = ref<Option[]>([])
const user_options   = ref<UserOption[]>([])

async function request_task() {
  task.value = new TaskFactory().generate()
}

async function request_questions() {
  questions.value = new QuestionFactory()
    .generate_multiple({ length: 12 })
}

async function request_options() {
  options.value = []

  for (const question of questions.value) {
    if (question.is_selector) {
      options.value.push(
        ...new OptionFactory({ task_id: task.value.id, question_id: question.id, exists: true })
          .generate_multiple({ length: 4 })
      )
    }
  }
}

async function request_user_task() {
  user_task.value = new UserTaskFactory().generate()

  user_task.value.exists = true
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

async function request_user_options() {
  user_options.value = new UserOptionFactory()
    .generate_multiple({ length: 48 })
    .map(user_option => {
      user_option.exists      = true
      user_option.task_id     = task.value.id
      user_option.question_id = questions.value.random().id


      return user_option
    })
}

const { pending } = useLazyAsyncData(async () => {
  await request_task()
  await request_questions()
  await request_options()
  await request_user_task()
  await request_user_questions()
  await request_user_options()
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
      <li><b>Estado:</b> {{ user_task.status }}</li>
      <li><b>Tiempo:</b> {{ user_task.time_expended.toFormat() }}</li>
    </ul>

    <v-user-question v-for="question in questions"
      :class="'container'"
      :key="question.id"
      :question="question"
      :options="options.filter(e => e.question_id == question.id)"
      :user_question="user_questions[question.id]"
      :user_options="user_options.filter(e => e.question_id == question.id)"
    />
  </main>
</template>

<style lang="scss">
.user-task {
  .user-question {
    display: grid;
    gap: 18px;
    .answer {
      color: var(--color-primary);
    }
    .comment {
      color: var(--color-red);
    }
  }
}
</style>
