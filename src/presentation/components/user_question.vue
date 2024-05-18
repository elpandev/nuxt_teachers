<script setup lang="ts">
import { user_question_request } from '~/src/config/repositories';
import type { Question } from '~/src/modules/question/domain/model';
import { UserQuestion } from '~/src/modules/user_question/domain/model';

interface IProps {
  question:      Question
  user_question: UserQuestion
}

const props         = defineProps<IProps>()
const user_question = ref<UserQuestion>(props.user_question)

const store = useRequest(async () => {
  await user_question_request.store(user_question.value)

  user_question.value.initial = new UserQuestion(user_question.value.toPayload())
})

onMounted(() => {
  user_question.value.initial = new UserQuestion(user_question.value.toPayload())
})
</script>

<template>
  <div class="user-question">
    <span>{{ props.question.question }}</span>

    <!-- <template v-if="props.question.is_selector">
      <ul class="options">
        <li v-for="option in question.options" :key="option.id">
          <input type="checkbox" :checked="user_question.options[option.id]" @change="user_question.on_option_checked(option)">
          <span>{{ option.option }}</span>
        </li>
      </ul>
    </template> -->

    <template v-if="props.question.is_text">
      <textarea v-model="user_question.answer"></textarea>
    </template>

    <button v-if="user_question.has_changed()" @click="store.request()">Guardar</button>
  </div>
</template>
