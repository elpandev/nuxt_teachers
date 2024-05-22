<script setup lang="ts">
import { user_question_request } from '~/src/config/repositories';
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
const user_question = ref<UserQuestion>(new UserQuestion({ user_id: props.user_id, task_id: props.task_id, question_id: props.question.id }))
const editable      = ref<boolean>(false)

function checked(option_id: string): boolean {
  const user_option = props.user_options.find(e => e.option_id == option_id)

  return user_option ? user_option.selected : false
}

const { request: store } = useRequest(async () => {
  user_question.value.exists
    ? await user_question_request.update(user_question.value.id, user_question.value)
    : await user_question_request.store (user_question.value)

  user_question.value.initial = new UserQuestion(user_question.value.toPayload())

  editable.value = false
})

function initialize_user_question() {
  if (props.user_question) {
    user_question.value = props.user_question
  }

  user_question.value.initial = new UserQuestion(user_question.value.toPayload())
}

onMounted(() => {
  initialize_user_question()
})
</script>

<template>
  <article class="v-user-question">
    <button v-if="editable" @click="store()">guardar</button>
    <button v-else          @click="editable = true">editar</button>

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
          <li class="option" v-for="option in $props.options" :key="option.id" :class="{ selected: option.selected, checked: checked(option.id) }">
            <v-icon-done  v-if="option.selected || checked(option.id)" />
            <v-icon-close v-else />

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
          <span class="points"><b>Calificación:</b> {{ user_question.points }}</span>
          <span class="comment"><b>Comentario:</b> {{ user_question.comment }}</span>
        </template>
      </footer>
    <!-- </template> -->

    <!-- <span v-else>El estudiante no ha respondido esta pregunta</span> -->
  </article>
</template>

<style lang="scss">
.v-user-question {
  display: grid;
  gap: 21px;
  > .options {
    display: grid;
    gap: 6px 12px;
    .option {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      border: 1px solid #eee;
      padding: 12px;
      border-radius: 12px;
      svg {
        opacity: 0.4;
        &.done {
          fill: var(--color-primary);
        }
        &.close {
          fill: var(--color-red);
        }
      }
      &.selected, &.checked {
        svg {
          &.close {
            display: none;
          }
        }
      }
      &.selected.checked {
        background-color: rgba(from var(--color-green) r g b / 0.04);
        border-color: rgba(from var(--color-green) r g b / 0.24);
        svg {
          opacity: 1;
          &.done {
            fill: var(--color-green);
          }
        }
      }
    }
  }
  > footer {
    display: grid;
  }
}
</style>
