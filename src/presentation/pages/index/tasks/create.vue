<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { TaskFactory } from '~/src/modules/task/domain/factory';
import { question_request, task_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { Question } from '~/src/modules/question/domain/model';
import type { Task } from '~/src/modules/task/domain/model';
import { QuestionFilter } from '~/src/modules/question/domain/filter';
import { QuestionFactory } from '~/src/modules/question/domain/factory';

const props     = defineProps<{ task_id?: string }>()
const title     = `${ props.task_id ? 'Editar' : 'Nueva' } Tarea`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()

const store = useRequest(async () => {
  try {
    await task_request.store(data.value!.task!)

    snackbar.value.success('La Tarea ha sido creada')

    data.value!.task = new TaskFactory().generate()
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

async function request_task(): Promise<Task|undefined> {
  return props.task_id
    ? await task_request.get(props.task_id)
    : new TaskFactory().generate()
}

async function request_questions(): Promise<Question[]> {
  return props.task_id
    ? await question_request.paginate(new QuestionFilter({ task_id: props.task_id }))
    : new QuestionFactory().generate_multiple({ length: 4 })
}

const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
  const [task, questions] = await Promise.all([
    request_task(),
    request_questions(),
  ])

  return { task, questions }
})

useSeoMeta({ title })
</script>

<template>
  <main v-if="!pending" class="create">
    <template v-if="data?.task && data.questions">
      <header>
        <h1>{{ title }}</h1>
        <span>Puntos: {{ data.task.calculate_points(data.questions) }}</span>
      </header>
      <form class="form" @submit.prevent="store.request()">
        <v-selector
          :label="'Activo'"
          :model-value="{ name: data!.task!.enabled ? 'SI' : 'NO', value: data!.task!.enabled }"
          :options="[{ name: 'SI', value: true }, { name: 'NO', value: false }]"
          @update:model-value="(value) => data!.task!.enabled = value"
        />

        <v-input :label="'Nombre'"       v-model="data.task.name" />
        <v-input :label="'Descripción'"  v-model="data.task.description" :textarea="true" />
        <v-input :label="'Calificación'" v-model="data.task.base_score" />

        <v-input
          :label="'Fecha de Inicio'"
          :type="'datetime-local'"
          :model-value="data.task.start_at ? new Date(data.task.start_at).toInput() : ''"
          @update:model-value="(value) => data!.task!.start_at = value ? new Date(value).getTime() : null"
        />

        <v-input
          :label="'Fecha de Finalización'"
          :type="'datetime-local'"
          :model-value="data.task.end_at ? new Date(data.task.end_at).toInput() : ''"
          @update:model-value="(value) => data!.task!.end_at = value ? new Date(value).getTime() : null"
        />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
