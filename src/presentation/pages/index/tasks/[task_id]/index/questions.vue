<script setup lang="ts">
import { question_request } from '~/src/config/repositories';
import type { Task } from '~/src/modules/task/domain/model';
import { nano_id } from '~/elpandev/utils';
import { Question, QuestionTypeEnum, question_type_options } from '~/src/modules/question/domain/model';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { SelectOption } from '~/src/presentation/models/select_option';

const attrs     = useAttrs()
const task      = attrs.task as Task
const snackbar  = useSnackbar()
const question  = ref<Question>(new Question())
const questions = ref<Question[]>([])

const { enabled: modal_enabled, open: open_modal, close: close_modal } = useModal()

function on_stored(_question: Question) {
  _question.exists
    ? questions.value.replaceFirst(e => e.id == _question.id, _question)
    : questions.value.push(_question)

  questions.value = [...questions.value]

  question.value = new Question()

  modal_enabled.value = false
}

function edit(_question: Question) {
  question.value = _question

  open_modal()
}

const { request: destroy } = useRequest(async (question: Question) => {
  await question_request.destroy(`${question.id}_${task.id}`)

  questions.value.removeWhere(e => e.id == question.id)
  questions.value = [...questions.value]

  snackbar.value.success('La pregunta ha sido eliminada')
})

const { request: request_questions } = useRequest(async () => {
  questions.value = await question_request
    .paginate(new QuestionFilter({ task_id: task.id }))
})

const { pending } = useLazyAsyncData(nano_id(), async () => {
  await request_questions()
})
</script>

<template>
  <section v-if="!pending" class="task-questions container">
    <header>
      <button @click="open_modal()">agregar</button>
    </header>
    <table class="table">
      <thead>
        <tr>
          <th>Pregunta</th>
          <th>Tipo</th>
          <th>Puntos</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td class="elipsis">{{ question.question }}</td>
          <td>{{ question.type }}</td>
          <td>{{ question.points }}</td>
          <td class="actions">
            <v-popup-menu>
              <button @click="edit(question)"><v-icon-edit /> Editar</button>
              <button @click="destroy(question)"><v-icon-destroy /> Eliminar</button>
            </v-popup-menu>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <Teleport to="#__nuxt">
    <v-modal v-if="modal_enabled" @closed="close_modal()" >
      <v-custom-form-question
        :task_id="task.id"
        :question="question"
        :on_stored="on_stored"
      />
    </v-modal>
  </Teleport>
</template>
