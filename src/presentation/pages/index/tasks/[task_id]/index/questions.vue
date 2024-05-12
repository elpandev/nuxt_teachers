<template>
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
              <button @click=""><v-icon-edit /> Editar</button>
              <button @click="destroy(question)"><v-icon-destroy /> Eliminar</button>
            </v-popup-menu>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <Teleport to="body">
    <v-modal v-if="question_modal.enabled.value" @closed="question_modal.close()" >
      <form @submit.prevent="store()">
        <v-selector
          v-model="question_type"
          :label="'Tipo de Pregunta'"
          :options="question_type_options"
        />

        <v-input v-model="question.question"      :label="'Pregunta'" />
        <v-input v-model.number="question.points" :label="'Puntos'" :type="'number'" />

        <section v-if="question.is_selector">
          <header>
            <h2>Opciones</h2>
            <button @click="question.push_option()" class="button outline icon teal" type="button">
              <v-icon-add />
            </button>
          </header>
          <div v-for="option in question.options" :key="option.id">
            <input   v-model="option.selected" type="checkbox" >
            <v-input v-model="option.option"   type="text" />
          </div>
        </section>

        <v-loader v-if="store_pending" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </v-modal>
  </Teleport>
</template>

<script setup lang="ts">
import { question_request } from '~/src/config/repositories';
import type { Task } from '~/src/modules/task/domain/model';
import { nano_id } from '~/elpandev/utils';
import { Question, QuestionTypeEnum, question_type_options } from '~/src/modules/question/domain/model';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { SelectOption } from '~/src/presentation/models/select_option';

const attrs          = useAttrs()
const task           = attrs.task as Task
const question_modal = useModal()
const route          = useRoute()
const snackbar       = useSnackbar()
const question       = ref<Question>(new Question())
const questions      = ref<Question[]>([])

const question_type = computed<SelectOption<QuestionTypeEnum>>({
  get() { return new SelectOption({ id: question.value.type, name: question.value.type, value: question.value.type }) },
  set(value) { question.value.type = value.value }
})

const { request: store, pending: store_pending } = useRequest(async () => {
  question.value.task_id = task.id

  await question_request.store(question.value)

  questions.value.push(question.value)
  questions.value = [...questions.value]

  question.value = new Question()
})

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
