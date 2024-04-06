<script setup lang="ts">
import { student_question_request } from '~/src/config/repositories';
import type { Question } from '~/src/modules/question/domain/model';
import { StudentQuestion } from '~/src/modules/student_question/domain/model';

interface IProps {
  question: Question
  student_question: StudentQuestion
}

const props            = defineProps<IProps>()
const student_question = ref<StudentQuestion>(props.student_question)

const store = useRequest(async () => {
  student_question.value.evaluate(props.question)

  await student_question_request.store(student_question.value)

  student_question.value.initial = student_question.value.copyWith()
})

onMounted(() => {
  student_question.value.initial = student_question.value.copyWith()
})
</script>

<template>
  <div class="student-question">
    <span>{{ props.question.question }}</span>

    <template v-if="props.question.is_selector">
      <ul class="options">
        <li v-for="option in question.options" :key="option.id">
          <input type="checkbox" :checked="student_question.options[option.id]" @change="student_question.on_option_checked(option)">
          <span>{{ option.option }}</span>
        </li>
      </ul>
    </template>

    <template v-if="props.question.is_text">
      <textarea v-model="student_question.text"></textarea>
    </template>

    <button v-if="student_question.has_changed" @click="store.request()">Guardar</button>
  </div>
</template>
