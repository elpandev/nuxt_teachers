<script setup lang="ts">
  import { Validator } from '@/elpandev/validator';
  import { Task } from '~/src/modules/task/domain/model';

  interface IProps {
    task: Task,
  }

  interface IEmits {
    (e: 'store:task', value: Task): any
  }

  const props     = defineProps<IProps>()
  const validator = ref<Validator<any, any>>(new Validator({ payload: {}, rules: {} }))
  const task      = ref<Task>(new Task().fromPayload(props.task?.toPayload()))
  const emits     = defineEmits<IEmits>()

  function store() {
    try {
      const validator = task.value.validate()
  
      if (!validator.validated) { throw validator }

      emits('store:task', task.value)
    }

    catch (error) {
      if (error instanceof Validator) { validator.value = error }

      console.error(error)
    }
  }
</script>

<template>
  <form class="form" @submit.prevent="store()">
    <v-form-input     :label="'Nombre'"      v-model="task.name" />
    <v-form-text-area :label="'Descripción'" v-model="task.description" />

    <button class="button outline text teal" type="submit">Guardar</button>
  </form>
</template>
