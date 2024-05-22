<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { TaskFactory } from '~/src/modules/task/domain/factory';
import { task_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { Task } from '~/src/modules/task/domain/model';
import { SelectOption } from '~/src/presentation/models/select_option';

const props     = defineProps<{ task_id?: string }>()
const title     = `${ props.task_id ? 'Editar' : 'Nueva' } Tarea`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()
const router    = useRouter()
const task      = ref<Task>(new Task())

const option_enabled = computed<SelectOption<boolean>>({
  get() { return new SelectOption({ name: task.value.enabled ? 'SI' : 'NO', value: task.value.enabled }) },
  set(value) { task.value.enabled = value.value },
})

const options_enabled: SelectOption<boolean>[] = [
  new SelectOption({ name: 'SI', value: true  }),
  new SelectOption({ name: 'NO', value: false }),
] 

const { request: store, pending: store_pending } = useRequest(async () => {
  try {
    props.task_id
      ? await task_request.update(task.value.id, task.value)
      : await task_request.store(task.value)

    snackbar.value.success('La Tarea ha sido creada')

    router.push(`/tasks/${task.value.id}`)
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

const { request: request_task } = useRequest(async () => {
  task.value = props.task_id
    ? await task_request.get(props.task_id) ?? new Task()
    : new TaskFactory().generate()
})

const { pending } = await useLazyAsyncData(nano_id(), async () => {
  await request_task()
})

useSeoMeta({ title })
</script>

<template>
  <main v-if="!pending" class="create">
    <header>
      <h1>{{ title }}</h1>
      <span>Puntos: 0</span>
    </header>
    <form class="form" @submit.prevent="store()">
      <v-selector
        v-model="option_enabled"
        :label="'Activo'"
        :options="options_enabled"
      />

      <v-input :label="'Nombre'"       v-model="task.name" />
      <v-input :label="'Descripción'"  v-model="task.description" :textarea="true" />

      <v-input
        :label="'Fecha de Inicio'"
        :type="'datetime-local'"
        :model-value="task.start_at ? new Date(task.start_at).toInput() : ''"
        @update:model-value="(value) => task.start_at = value ? new Date(value).getTime() : null"
      />

      <v-input
        :label="'Fecha de Finalización'"
        :type="'datetime-local'"
        :model-value="task.end_at ? new Date(task.end_at).toInput() : ''"
        @update:model-value="(value) => task.end_at = value ? new Date(value).getTime() : null"
      />

      <v-loader v-if="store_pending" />
      <button v-else class="button outline text teal" type="submit">Guardar</button>
    </form>
  </main>
  <v-loader v-else />
</template>
