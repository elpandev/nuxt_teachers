<script setup lang="ts">
import { question_request, user_task_request, task_request, user_question_request, option_request, user_option_request } from '~/src/config/repositories';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { UserQuestionFilter } from '~/src/modules/user_question/domain/filter';
import { Question } from '~/src/modules/question/domain/model';
import { UserQuestion, UserQuestionStatusEnum } from '~/src/modules/user_question/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { nano_id } from '~/elpandev/utils';
import { useAuthState } from '~/src/presentation/states/auth';
import { UserTask, UserTaskStatusEnum } from '~/src/modules/user_task/domain/model';
import { Task } from '~/src/modules/task/domain/model';
import { TaskFactory } from '~/src/modules/task/domain/factory';
import { QuestionFactory } from '~/src/modules/question/domain/factory';
import type { Option } from '~/src/modules/option/domain/model';
import { OptionFactory } from '~/src/modules/option/domain/factory';
import { UserQuestionFactory } from '~/src/modules/user_question/domain/factory';
import { UserOption } from '~/src/modules/user_option/domain/model';
import { OptionFilter } from '~/src/modules/option/domain/filter';
import { UserOptionFilter } from '~/src/modules/user_option/domain/filter';

enum PageEnum {
  USER      = 'USER',
  TASK      = 'TASK',
  COMPLETED = 'COMPLETED',
}

const route                 = useRoute()
const task_id               = route.params.task_id as string
const user_id               = ref<string>('')
const snackbar              = useSnackbar()
const page                  = ref<PageEnum>(PageEnum.USER)
const task                  = ref<Task>(new TaskFactory().generate())
const user_task             = ref<UserTask>(new UserTask())
const questions             = ref<Question[]>([])
const options               = ref<Option[]>([])
const user_questions        = ref<UserQuestion[]>([])
const user_options          = ref<UserOption[]>([])
const prev_question         = ref<Question>()
const next_question         = ref<Question>()
const current_question      = ref<Question>(new Question())
const current_options       = ref<Option[]>([])
const current_user_question = ref<UserQuestion>(new UserQuestion())
const current_user_options  = ref<UserOption[]>([])

function select_question(_question?: Question) {
  if (_question === undefined) return

  current_question     .value = _question
  current_options      .value = options       .value.filter(e => e.question_id == _question.id)
  current_user_question.value = user_questions.value.find  (e => e.question_id == _question.id) ?? new UserQuestion({ task_id, user_id: user_id.value, question_id: _question.id })
  current_user_options .value = user_options  .value.filter(e => e.question_id == _question.id)

  prev_question.value = get_prev_question()
  next_question.value = get_next_question()
}

function get_prev_question(): Question|undefined {
  const index = questions.value.findIndex(e => e.id == current_question.value.id)

  for (let i = index - 1; i >= 0; i--) {
    const question      = questions.value[i];
    const user_question = user_questions.value.find(e => e.question_id == question.id)
    
    if (user_question === undefined || user_question?.is_pending) {
      return question
    }
  }

  return undefined
}

function get_next_question(): Question|undefined {
  const index = questions.value.findIndex(e => e.id == current_question.value.id)

  for (let i = index + 1; i < questions.value.length; i++) {
    const question      = questions.value[i];
    const user_question = user_questions.value.find(e => e.question_id == question.id)
    
    if (user_question === undefined || user_question?.is_pending) {
      return question
    }
  }

  return undefined
}

function get_user_question_status(question_id: string): UserQuestionStatusEnum {
  return user_questions.value.find(e => e.question_id == question_id)?.status ?? UserQuestionStatusEnum.PENDING
}

function get_user_option_selected(option_id: string): boolean {
  return user_options.value.find(e => e.option_id == option_id)?.selected ?? false
}

function on_user_option_selected(option_id: string, selected: boolean) {
  const user_option = user_options.value.find(e => e.option_id == option_id) ?? new UserOption({ task_id, user_id: user_id.value, question_id: current_question.value.id, option_id })

  console.log(user_option)

  user_option.selected = selected

  if (user_options.value.some(e => e.option_id == option_id)) {
    user_options        .value.replaceFirst(e => e.option_id == option_id, user_option)
    current_user_options.value.replaceFirst(e => e.option_id == option_id, user_option)
  }
  else {
    user_options        .value.push(user_option)
    current_user_options.value.push(user_option)
  }
}

async function request_task() {
  task.value = await task_request.get(task_id) ?? new Task({ id: task_id })
}

async function request_questions() {
  questions.value = await question_request.paginate(new QuestionFilter({ task_id }))
}

async function request_options() {
  options.value = await option_request.paginate(new OptionFilter({ task_id }))
}

async function request_user_task() {
  user_task.value = await user_task_request.get(`${user_id.value}_${task_id}`) ?? new UserTask({ user_id: user_id.value, task_id })
}

async function request_user_questions() {
  user_questions.value = await user_question_request.paginate(new UserQuestionFilter({ task_id, user_id: user_id.value })) ?? []
}

async function request_user_options() {
  user_options.value = await user_option_request.paginate(new UserOptionFilter({ task_id, user_id: user_id.value }))
}

async function store_user_question() {
  current_user_question.value.status = UserQuestionStatusEnum.COMPLETED

  current_user_question.value.exists
    ? await user_question_request.update(current_user_question.value.id, current_user_question.value)
    : await user_question_request.store(current_user_question.value)

  user_questions.value.some(e => e.id == current_user_question.value.id)
    ? user_questions.value.replaceFirst(e => e.id == current_user_question.value.id, current_user_question.value)
    : user_questions.value.push(current_user_question.value)

  user_questions.value = [...user_questions.value]
}

async function store_user_options() {
  if (current_question.value.is_selector) {
    await Promise.all(
      current_user_options.value.map(option => {
        option.exists
          ? user_option_request.update(option.id, option)
          : user_option_request.store(option)
      })
    )

    user_options.value = [...user_options.value, ...current_user_options.value]
  }
}

const { request: start, pending: start_pending } = useRequest(async () => {
  await request_user_task()

  if (!user_task.value.exists) {
    return snackbar.value.error('El estudiante no ha sido registrado para este exámen')
  }

  if (user_task.value.is_completed) {
    return snackbar.value.error('El estudiante ya ha completado este exámen')
  }

  if (user_task.value.is_pending) {
    await user_task_request.update(`${user_id.value}_${task_id}`, { status: UserTaskStatusEnum.STARTED })
  }

  await Promise.all([
    request_task(),
    request_questions(),
    request_options(),
    request_user_questions(),
    request_user_options(),
  ])

  select_question(questions.value[0])

  page.value = PageEnum.TASK
})

const { request: store_question, pending: store_pending } = useRequest(async () => {
  await store_user_question()
  await store_user_options()

  snackbar.value.success('La pregunta ha sido guardada')
})

const { request: complete } = useRequest(async () => {
  await user_task_request.update(`${user_id.value}_${task_id}`, { status: UserTaskStatusEnum.COMPLETED })

  page.value = PageEnum.COMPLETED
})

const { pending } = useLazyAsyncData(async () => {
  await request_task()
})
</script>

<template>
  <main class="user-task" :class="page">
    <template v-if="page == PageEnum.USER">
      <header>
        <h1>{{ task.name }}</h1>
        <p>{{ task.description }}</p>
      </header>

      <span>Duración: {{ task.time_formatted }}</span>
      <span>Preguntas: {{ task.questions_count }}</span>

      <input v-model="user_id" type="text">
      <button v-if="!start_pending" @click="start()">empezar</button>
      <v-loader v-else />
    </template>

    <template v-if="page == PageEnum.TASK">
      <header>
        <v-task-timer v-if="task.end_at" :end_at="task.end_at" />
      </header>

      <nav>
        <template v-for="(_question, i) in questions" :key="current_question.id">
          <button
            :class="{ selected: current_question.id == _question.id, [get_user_question_status(_question.id)]: true  }"
            @click="select_question(_question)"
          >
            <v-icon-done />
            <span class="name">{{ i + 1 }}</span>
          </button>
        </template>
      </nav>

      <section class="question">
        <header>
          <h3>{{ current_question.question }}</h3>
          <p v-if="current_question.description">{{ current_question.description }}</p>
        </header>

        <template v-if="current_question.is_text">
          <textarea v-model="current_user_question.answer" rows="5"></textarea>
        </template>

        <template v-if="current_question.is_selector">
          <div class="options">
            <template v-for="option in current_options" :key="option.id">
              <label class="option" :for="`option-${option.id}`">
                <input :id="`option-${option.id}`" type="checkbox" :checked="get_user_option_selected(option.id)" @change="on_user_option_selected(option.id, ($event.target as any).checked)">
                <span>{{ option.option }}</span>
              </label>
            </template>
          </div>
        </template>

        <footer>
          <button class="arrow" :class="{ enabled: prev_question !== undefined }" @click="select_question(prev_question)"><v-icon-arrow-back-ios /></button>
          <button class="restart"><v-icon-restart /></button>
          <button class="store" @click="store_question()">Guardar</button>
          <button class="arrow" :class="{ enabled: next_question !== undefined }" @click="select_question(next_question)"><v-icon-arrow-forward-ios /></button>
        </footer>
      </section>

      <footer>
        <button class="complete" @click="complete()">Completar</button>
      </footer>
    </template>
  
    <template v-if="page == PageEnum.COMPLETED">
      <span>El exámen ha sido completado</span>
    </template>
  </main>
</template>

<style lang="scss">
main.user-task {
  &.USER {
    display: grid;
    height: 100vh;
    place-items: center;
    align-content: center;
    justify-content: center;
    > header {
      text-align: center;
    }
  }
  &.TASK {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 0;
    > header {
      display: flex;
      justify-content: flex-end;
      padding: 12px 18px;
    }
    > nav {
      display: grid;
      align-content: start;
      grid-column: 1;
      grid-row: 1/5;
      height: 100vh;
      border-right: 1px solid #ddd;
      button {
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        background-color: white;
        &:nth-child(n+1) {
          border-top: 1px solid #ddd;
        }
        &:hover {
          background-color: #eee;
        }
        &.selected {
          background-color: var(--color-primary);
          color: white;
        }
        &.PENDING {
          svg {
            &.done {
              display: none;
            }
          }
        }
        &.COMPLETED {
          svg {
            &.done {
              display: block;
            }
          }
          span {
            display: none;
          }
          &.selected {
            background-color: var(--color-green);
            .v-icon-done {
              fill: white;
            }
          }
        }
      }
    }
    > section {
      &.question {
        display: grid;
        gap: 64px;
        place-items: center;
        align-content: center;
        > header {
          display: grid;
          gap: 12px;
          place-items: center;
          text-align: center;
          > h3 {
            font-size: 24px;
          }
        }
        .options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
          max-width: 764px;
          width: 100%;
          .option {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 12px;
            background-color: #f7f7f7;
            border-radius: 4px;
            padding: 12px 21px 12px 12px;
            border: 1px solid #ddd;
            cursor: pointer;
          }
        }
        textarea {
          max-width: 764px;
          font-size: 17px;
          padding: 15px 21px;
        }
        > footer {
          display: flex;
          align-items: center;
          gap: 12px;
          button {
            &.arrow {
              background-color: #eee;
              border-radius: 9px;
              padding: 9px;
              svg {
                fill: white;
              }
              margin: 0 21px;
              &.enabled {
                background-color: var(--color-primary);
              }
            }
            &.restart {
              background-color: var(--color-orange);
              border-radius: 9px;
              padding: 9px;
              svg {
                fill: white;
              }
            }
            &.store {
              background-color: var(--color-green);
              color: white;
              border-radius: 9px;
              padding: 9px 21px;
              transition: .1s;
            }
          }
        }
      }
    }
    > footer {
      display: flex;
      justify-content: flex-end;
      padding: 18px;
      button {
        background-color: var(--color-primary);
        padding: 12px 18px;
        border-radius: 9px;
        color: white;
      }
    }
  }
  &.COMPLETED {

  }
}
</style>
