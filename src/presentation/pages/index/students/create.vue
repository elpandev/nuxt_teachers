<script setup lang="ts">
  import { Validator } from '@/elpandev/validator';
  import { nano_id } from "@/elpandev/utils/methods/nano_id";
  import { StudentFactory } from '~/src/modules/student/domain/factory';
  import { student_request } from '~/src/config/repositories';
  import { useSnackbar } from '~/src/presentation/states/snackbar';

  const props     = defineProps<{ student_id?: string }>()
  const title     = `${ props.student_id ? 'Editar' : 'Nuevo' } Estudiante`
  const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
  const snackbar  = useSnackbar()

  const store = useRequest(async () => {
    try {
      await student_request.store(data.value!.student!)

      snackbar.value.success(`El estudiante "${data.value!.student!.name}" ha sido creado`)

      data.value!.student = new StudentFactory().generate()
    }

    catch (error) {
      if (error instanceof Validator) { validator.value = error }

      console.error(error)
    }
  })

  const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
    const student = props.student_id
      ? await student_request.get(props.student_id)
      : new StudentFactory().generate()

    return { student }
  })

  useSeoMeta({ title })
</script>

<template>
  <v-custom-header-primary :name="title" />

  <main v-if="!pending" class="create">
    <template v-if="data?.student">
      <form class="form" @submit.prevent="store.request()">
        <v-input :label="'Nombre'" v-model="data.student.name" />
        <v-input :label="'Email'"  v-model="data.student.email" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
