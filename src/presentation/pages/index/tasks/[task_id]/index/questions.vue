<script setup lang="ts">
import { question_request, student_question_request, student_task_request } from '~/src/config/repositories';
import type { Task } from '~/src/modules/task/domain/model';
import { nano_id } from '~/elpandev/utils';
import { Question } from '~/src/modules/question/domain/model';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { StudentQuestionFilter } from '~/src/modules/student_question/domain/filter';
import type { StudentQuestion } from '~/src/modules/student_question/domain/model';
import type { StudentTask } from '~/src/modules/student_task/domain/model';
import { StudentTaskFilter } from '~/src/modules/student_task/domain/filter';
import type { ISelectOption } from '~/src/presentation/interfaces/select_option';
import { Student } from '~/src/modules/student/domain/model';

const attrs             = useAttrs()
const task              = attrs.task as Task
const points            = attrs.points as number
const question_modal    = useModal()
const route             = useRoute()
const snackbar          = useSnackbar()
const question_selected = ref<Question>(new Question())
const questions         = ref<Question[]>([])
const student_task      = ref<StudentTask>()
const student_questions = ref<StudentQuestion[]>([])

const destroy = useRequest(async (question: Question) => {
  await question_request.destroy(`${question.id}_${task.id}`)

  questions.value.removeWhere(e => e.id == question.id)
  questions.value = [...questions.value]

  snackbar.value.success('La pregunta ha sido eliminada')
})

function open_question_selected(question: Question) {
  question_selected.value = question.copyWith()

  question_modal.open()
}

function on_stored(question: Question) {
  questions.value.some(e => e.id == question.id)
    ? questions.value.replaceFirst(e => e.id == question.id, question)
    : questions.value.push(question)

  questions.value = [...questions.value]

  snackbar.value.success('La pregunta ha sido guardada')
}

async function request_student_task_options(name: string): Promise<ISelectOption<StudentTask>[]> {
  const student_tasks = await student_task_request
    .paginate(new StudentTaskFilter({ task_id: task.id }))

  return student_tasks.map(e => e.toSelectOption())
}

const { pending } = useLazyAsyncData(nano_id(), async () => {
  const [_questions, _student_task] = await Promise.all([
    question_request.paginate(new QuestionFilter({ task_id: task.id })),
    route.query.student_id ? student_task_request.get(`${route.query.student_id}_${task.id}`) : undefined,
  ])

  questions   .value = _questions
  student_task.value = _student_task
})

watch(student_task, async (value) => {
  student_questions.value = value === undefined
    ? []
    : await student_question_request.paginate(new StudentQuestionFilter({ task_id: task.id, student_id: value.student.id }))
})
</script>

<template>
  <div v-if="!pending" class="container">
    <v-selector
      :model-value="{ name: student_task?.student.name ?? '', value: student_task }"
      :request="request_student_task_options"
      :input="false"
      :restart="() => student_task = undefined"
      @update:model-value="(value) => student_task = value"
    />
  </div>

  <section v-if="!pending" class="task-questions container">
    <header>
      <button @click="question_modal.open()">agregar</button>
    </header>
    <table class="table">
      <thead>
        <tr>
          <th>Pregunta</th>
          <th>Tipo</th>
          <th>Puntos</th>
          <template v-if="student_task">
            <th>Calificación</th>
          </template>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td class="elipsis">{{ question.question }}</td>
          <td>{{ question.type }}</td>
          <td>{{ question.points }}</td>
          <template v-if="student_task">
            <td>{{ student_questions.find(e => e.question_id == question.id)?.points }}</td>
          </template>
          <td class="actions">
            <v-popup-menu>
              <button @click="open_question_selected(question)"><v-icon-edit /> Editar</button>
              <button @click="destroy.request(question)"><v-icon-destroy /> Eliminar</button>
            </v-popup-menu>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <Teleport to="body">
    <v-modal v-if="question_modal.enabled.value" @closed="question_modal.close()" >
      <v-custom-form-question :task_id="task.id" :question="question_selected" @stored="on_stored" />
    </v-modal>
  </Teleport>
</template>
