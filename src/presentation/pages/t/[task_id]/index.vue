<script setup lang="ts">
import { question_request, user_task_request, task_request, user_question_request } from '~/src/config/repositories';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { UserQuestionFilter } from '~/src/modules/user_question/domain/filter';
import type { Question } from '~/src/modules/question/domain/model';
import { UserQuestion } from '~/src/modules/user_question/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { nano_id } from '~/elpandev/utils';
import { useAuthState } from '~/src/presentation/states/auth';
import { UserTask, UserTaskStatusEnum } from '~/src/modules/user_task/domain/model';
import { Task } from '~/src/modules/task/domain/model';

enum PageEnum {
  INTRO     = 'INTRO',
  USER      = 'USER',
  TASK      = 'TASK',
  COMPLETED = 'COMPLETED',
}

const route          = useRoute()
const task_id        = route.params.task_id as string
const user_id        = ref<string>('')
const snackbar       = useSnackbar()
const page           = ref<PageEnum>(PageEnum.USER)
const task           = ref<Task>(new Task())
const user_task      = ref<UserTask>(new UserTask())
const questions      = ref<Map<string, Question>>(new Map())
const user_questions = ref<Map<string, UserQuestion>>(new Map())

const { request: start, pending: start_pending } = useRequest(async () => {
  user_task.value = await user_task_request.get(`${user_id.value}_${task_id}`) ?? new UserTask()

  if (!user_task.value.exists) {
    return snackbar.value.error('El estudiante no ha sido registrado para este exámen')
  }

  if (user_task.value.is_completed) {
    return snackbar.value.error('El estudiante ya ha completado este exámen')
  }

  if (user_task.value.is_pending) {
    await user_task_request.update(`${user_id.value}_${task_id}`, { status: UserTaskStatusEnum.STARTED })
  }

  const [_questions, _user_questions] = await Promise.all([
    question_request.paginate(new QuestionFilter({ task_id })),
    user_question_request.paginate(new UserQuestionFilter({ task_id, user_id: user_id.value })),
  ])

  for (const user_question of _user_questions) {
    user_questions.value.set(user_question.id, user_question)
  }

  for (const question of _questions) {
    questions.value.set(question.id, question)

    const user_question = new UserQuestion({
      task_id:     task.value.id,
      user_id:     user_id.value,
      question_id: question.id,
    })

    if (!user_questions.value.has(user_question.id)) {
      user_questions.value.set(user_question.id, user_question)
    }
  }

  page.value = PageEnum.TASK
})

const complete = useRequest(async () => {
  await user_task_request.update(`${user_id.value}_${task_id}`, { status: UserTaskStatusEnum.COMPLETED })

  page.value = PageEnum.COMPLETED
})
</script>

<template>
  <main>
    <template v-if="page == PageEnum.USER">
      <div>
        <input v-model="user_id" type="text">
        <button v-if="!start_pending" @click="start()">empezar</button>
        <v-loader v-else />
      </div>
    </template>

    <template v-if="page == PageEnum.TASK">
      <header>
        <h1>{{ task.name }}</h1>
        <p>{{ task.description }}</p>
      </header>

      <section>
        <header>
          <h3>{{ questions.size }} Preguntas</h3>
        </header>
        <div class="responses">
          <v-user-question
            v-for="question in questions.values()"
            :key="question.id"
            :question="question"
            :user_question="user_questions.get(`${user_id}_${question.id}`)!"
          />
        </div>
      </section>

      <footer>
        <button @click="complete.request()">completar</button>
      </footer>
    </template>

    <template v-if="page == PageEnum.COMPLETED">
      <span>El exámen ha sido completado</span>
    </template>
  </main>
</template>
