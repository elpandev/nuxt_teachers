<script setup lang="ts">
import { option_request, question_request } from '~/src/config/repositories';
import { Option } from '~/src/modules/option/domain/model';
import { Question, QuestionTypeEnum, question_type_options } from '~/src/modules/question/domain/model';
import type { SelectOption } from '~/src/presentation/models/select_option';

interface IProps {
  task_id: string
  question: Question
  options: Option[]
  on_stored: (question: Question) => void
}

const type_option =  computed<SelectOption<QuestionTypeEnum>>({
  get() { return question_type_options.find(e => e.value == question.value.type)! },
  set(value) { question.value.type = value.value }
})

const props    = withDefaults(defineProps<IProps>(), { question: () => new Question(), options: () => [] })
const question = ref<Question>(props.question)
const options  = ref<Option[]>(props.options)

function push_option() {
  const option = new Option({
    task_id:     props.task_id,
    question_id: question.value.id,
  })

  options.value = [...options.value, option]
}

const { request: store_question } = useRequest(async () => {
  question.value.task_id = props.task_id

  question.value.exists
    ? await question_request.update(question.value.id, question.value)
    : await question_request.store(question.value)
})

const { request: store_options } = useRequest(async () => {
  await Promise.all(
    options.value.map(option => option_request.store(option))
  )
})

const { request: store, pending: store_pending } = useRequest(async () => {
  await store_question()
  await store_options()

  props.on_stored(question.value)

})
</script>

<template>
  <form @submit.prevent="store()">
    <v-selector
      v-model="type_option"
      :label="'Tipo de Pregunta'"
      :options="question_type_options"
    />

    <v-input v-model="question.question"      :label="'Pregunta'" />
    <v-input v-model.number="question.points" :label="'Puntos'" :type="'number'" />

    <section v-if="question.is_selector">
      <header>
        <h2>Opciones</h2>
        <button @click="push_option()" class="button outline icon teal" type="button">
          <v-icon-add />
        </button>
      </header>
      <div v-for="option in options" :key="option.id">
        <input v-model="option.selected" type="checkbox" >
        <input v-model="option.option"   type="text" />
      </div>
    </section>

    <v-loader v-if="store_pending" />
    <button v-else class="button outline text teal" type="submit">Guardar</button>
  </form>
</template>
