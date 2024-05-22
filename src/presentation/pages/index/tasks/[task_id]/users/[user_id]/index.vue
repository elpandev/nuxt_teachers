<script setup lang="ts">
import { option_request, question_request, task_request, user_option_request, user_question_request, user_task_request } from '~/src/config/repositories';
import { OptionFilter } from '~/src/modules/option/domain/filter';
import type { Option } from '~/src/modules/option/domain/model';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import type { Question } from '~/src/modules/question/domain/model';
import { Task } from '~/src/modules/task/domain/model';
import { UserOptionFilter } from '~/src/modules/user_option/domain/filter';
import type { UserOption } from '~/src/modules/user_option/domain/model';
import { UserQuestionFilter } from '~/src/modules/user_question/domain/filter';
import { UserQuestion } from '~/src/modules/user_question/domain/model';
import { UserTask } from '~/src/modules/user_task/domain/model';

const route          = useRoute()
const task_id        = route.params.task_id as string
const user_id        = route.params.user_id as string
const task           = ref<Task>(new Task())
const user_task      = ref<UserTask>(new UserTask())
const questions      = ref<Question[]>([])
const user_questions = ref<UserQuestion[]>([])
const options        = ref<Option[]>([])
const user_options   = ref<UserOption[]>([])

async function request_task() {
  task.value = await task_request.get(task_id) ?? new Task({ id: task_id })
}

async function request_questions() {
  questions.value = await question_request.paginate(new QuestionFilter({ task_id }))
}

async function request_options() {
  options.value = await option_request.paginate(new OptionFilter({ task_id }))
}

async function request_user_task() {
  user_task.value = await user_task_request.get(`${user_id}_${task_id}`) ?? new UserTask({ user_id, task_id })
}

async function request_user_questions() {
  user_questions.value = await user_question_request.paginate(new UserQuestionFilter({ task_id, user_id })) ?? []
}

async function request_user_options() {
  user_options.value = await user_option_request.paginate(new UserOptionFilter({ task_id, user_id }))
}

function organize_questions() {
  for (const question of questions.value) {
    question.options = options.value.filter(e => e.question_id == question.id)
  }
}

function organize_user_questions() {
  for (const user_question of user_questions.value) {
    user_question.user_options = user_options.value.filter(e => e.question_id == user_question.question_id)
  }
}

const { pending } = useLazyAsyncData(async () => {
  await Promise.all([
    request_task(),
    request_questions(),
    request_options(),
    request_user_task(),
    request_user_questions(),
    request_user_options(),
  ])

  organize_questions()
  organize_user_questions()
})
</script>

<template>
  <v-custom-header-primary :name="`${user_task.user_name}`">
    <template #buttons>
      <nuxt-link to="/tasks/create" class="button solid text teal">Nuevo Exámen</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main v-if="!pending" class="document user-task">
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
      :task_id="task_id"
      :user_id="user_id"
      :question="question"
      :user_question="user_questions.find(e => e.question_id == question.id)"
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
