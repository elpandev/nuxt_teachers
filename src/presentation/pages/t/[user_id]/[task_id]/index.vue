<script setup lang="ts">
import { question_request, student_task_request, task_request, student_question_request } from '~/src/config/repositories';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { StudentQuestionFilter } from '~/src/modules/student_question/domain/filter';
import type { Question } from '~/src/modules/question/domain/model';
import { StudentQuestion } from '~/src/modules/student_question/domain/model';
import { StudentTask, StudentTaskStatusEnum } from '~/src/modules/student_task/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { nano_id } from '~/elpandev/utils';
import { useAuthState } from '~/src/presentation/states/auth';

enum PageEnum {
  INTRO     = 'INTRO',
  STUDENT   = 'STUDENT',
  TASK      = 'TASK',
  COMPLETED = 'COMPLETED',
}

const route             = useRoute()
const user_id           = route.params.user_id as string
const task_id           = route.params.task_id as string
const student_id        = ref<string>('')
const snackbar          = useSnackbar()
const page              = ref<PageEnum>(PageEnum.STUDENT)
const student_task      = ref<StudentTask>()
const questions         = ref<Map<string, Question>>(new Map())
const student_questions = ref<Map<string, StudentQuestion>>(new Map())
const auth              = useAuthState()

const start = useRequest(async () => {
  student_task.value = await student_task_request.get(`${student_id.value}_${task_id}`)

  if (student_task.value === undefined) {
    return snackbar.value.error('El estudiante no ha sido registrado para este exámen')
  }

  if (student_task.value.is_completed) {
    return snackbar.value.error('El estudiante ya ha completado este exámen')
  }

  if (student_task.value.is_pending) {
    await student_task_request.update(`${student_id.value}_${task_id}`, { status: StudentTaskStatusEnum.STARTED })
  }

  const [_questions, _student_questions] = await Promise.all([
    question_request.paginate(new QuestionFilter({ task_id })),
    student_question_request.paginate(new StudentQuestionFilter({ task_id, student_id: student_id.value })),
  ])

  for (const student_question of _student_questions) {
    student_questions.value.set(student_question.id, student_question)
  }

  for (const question of _questions) {
    questions.value.set(question.id, question)

    const student_question = new StudentQuestion({
      id:          `${student_id.value}_${question.id}`,
      student_id:  student_id.value,
      question_id: question.id,
      task_id:     data.value!.task!.id
    })

    if (!student_questions.value.has(student_question.id)) {
      student_questions.value.set(student_question.id, student_question)
    }
  }

  page.value = PageEnum.TASK
})

const complete = useRequest(async () => {
  await student_task_request.update(`${student_id.value}_${task_id}`, { status: StudentTaskStatusEnum.COMPLETED })

  page.value = PageEnum.COMPLETED
})

const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
  auth.value.user.id = user_id

  const task = await task_request.get(task_id)

  return { task }
})
</script>

<template>
  <main v-if="!pending">
    <template v-if="data?.task">
      <template v-if="page == PageEnum.STUDENT">
        <div>
          <input v-model="student_id" type="text">
          <button v-if="!start.pending.value" @click="start.request()">empezar</button>
          <v-loader v-else />
        </div>
      </template>

      <template v-if="page == PageEnum.TASK">
        <header>
          <h1>{{ data.task.name }}</h1>
          <p>{{ data.task.description }}</p>
        </header>
  
        <section>
          <header>
            <h3>{{ questions.size }} Preguntas</h3>
          </header>
          <div class="responses">
            <v-student-question
              v-for="question in questions.values()"
              :key="question.id"
              :question="question"
              :student_question="student_questions.get(`${student_id}_${question.id}`)!"
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
    </template>
    <span v-else>Esta Tarea no existe</span>
  </main>
  <v-loader v-else />
</template>
