<script setup lang="ts">
import { question_request } from '~/src/config/repositories';
import { Question, question_type_options } from '~/src/modules/question/domain/model';

interface IProps {
  task_id: string
  question?: Question
}

interface IEmits {
  (e: 'stored', value: Question): void
}

const props    = defineProps<IProps>()
const emit     = defineEmits<IEmits>()
const question = ref<Question>(props.question?.copyWith() ?? new Question())

const store = useRequest(async () => {
  question.value.task_id = props.task_id

  await question_request.store(question.value)

  emit('stored', question.value.copyWith())

  question.value = new Question()
})
</script>

<template>
  <form @submit.prevent="store.request()">
    <v-selector
      v-model="question.type"
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

    <v-loader v-if="store.pending.value" />
    <button v-else class="button outline text teal" type="submit">Guardar</button>
  </form>
</template>
