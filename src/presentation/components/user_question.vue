<script setup lang="ts">
import { user_option_request } from '~/src/config/repositories';
import type { Option } from '~/src/modules/option/domain/model';
import type { Question } from '~/src/modules/question/domain/model';
import { UserOption } from '~/src/modules/user_option/domain/model';
import { UserQuestion } from '~/src/modules/user_question/domain/model';

interface IProps {
  user_id :       string
  task_id :       string
  question :      Question
  options :       Option[]
  user_question?: UserQuestion
  user_options :  UserOption[]
}

const props         = defineProps<IProps>()
const user_question = ref<UserQuestion>(props.user_question ?? new UserQuestion())
const editable      = ref<boolean>(false)

function checked(option_id: string): boolean {
  const user_option = props.user_options.find(e => e.option_id == option_id)

  return user_option ? user_option.selected : false
}

async function on_checked(option_id: string) {
  const user_option = props.user_options.find(e => e.option_id == option_id) ?? new UserOption({
    user_id:     props.user_id,
    task_id:     props.task_id,
    question_id: props.question.id,
    option_id:   option_id,
  })

  user_option.selected = !user_option.selected

  user_option.selected
    ? await user_option_request.store(user_option)
    : await user_option_request.destroy(user_option.id)
}

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
    
    <!-- <template v-if="user_question.exists"> -->
      <template v-if="$props.question.is_text">
        <span class="answer">{{ user_question.answer }}</span>
      </template>

      <template v-if="$props.question.is_selector">
        <ul class="options">
          <li v-for="option in $props.options" :key="option.id">
            <input type="checkbox" :checked="checked(option.id)" @change="on_checked(option.id)">
            <span>{{ option.option }}</span>
          </li>
        </ul>
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
    <!-- </template> -->

    <!-- <span v-else>El estudiante no ha respondido esta pregunta</span> -->
  </article>
</template>
