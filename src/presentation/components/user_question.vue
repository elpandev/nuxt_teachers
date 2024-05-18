<script setup lang="ts">
import type { Question } from '~/src/modules/question/domain/model';
import { UserQuestion } from '~/src/modules/user_question/domain/model';

interface IProps {
  question:       Question
  user_question?: UserQuestion
}

const props         = defineProps<IProps>()
const user_question = ref<UserQuestion>(props.user_question ?? new UserQuestion())
const editable      = ref<boolean>(false)

const { request: store } = useRequest(async () => {
  user_question.value.initial = new UserQuestion(user_question.value.toPayload())

  editable.value = false
})

onMounted(() => {
  user_question.value.initial = new UserQuestion(user_question.value.toPayload())
})
</script>

<template>
  <article class="user-question">
    <template v-if="user_question.exists">
      <button v-if="editable" @click="store()">guardar</button>
      <button v-else          @click="editable = true">editar</button>
    </template>

    <header>
      <h3>{{ $props.question.question }}</h3>
      <p>{{ $props.question.description }}</p>
    </header>
    
    <template v-if="user_question.exists">
      <template v-if="$props.question.is_text">
        <span class="answer">{{ user_question.answer }}</span>
      </template>

      <footer>
        <template v-if="editable">
          <input v-model="user_question.points" type="number">
          <textarea v-model="user_question.comment" class="comment"></textarea>
        </template>

        <template v-else>
          <span class="points">{{ user_question.points }}</span>
          <span class="comment">{{ user_question.comment }}</span>
        </template>
      </footer>
    </template>

    <span v-else>El estudiante no ha respondido esta pregunta</span>
  </article>
</template>
