<script setup lang="ts">
  import { Validator } from '@/elpandev/validator';
  import { nano_id } from "@/elpandev/utils/methods/nano_id";
  import { CourseFactory } from '~/src/modules/course/domain/factory';
  import { course_request } from '~/src/config/repositories';
  import { useSnackbar } from '~/src/presentation/states/snackbar';

  const router    = useRouter()
  const props     = defineProps<{ course_id?: string }>()
  const title     = `${ props.course_id ? 'Editar' : 'Nuevo' } Curso`
  const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
  const snackbar  = useSnackbar()

  const store = useRequest(async () => {
    try {
      props.course_id
        ? await course_request.update(props.course_id, data.value!.course!)
        : await course_request.store(data.value!.course!)

      snackbar.value.success(`El curso "${data.value!.course!.name}" ha sido creado`)

      router.push(`/courses/${data.value!.course!.id}/users`)
    }

    catch (error) {
      if (error instanceof Validator) { validator.value = error }

      console.error(error)
    }
  })

  const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
    const course = props.course_id
      ? await course_request.get(props.course_id)
      : new CourseFactory().generate()

    return { course }
  })

  useSeoMeta({ title })
</script>

<template>
  <v-custom-header-primary :name="title" />

  <main v-if="!pending" class="create">
    <template v-if="data?.course">
      <form class="form" @submit.prevent="store.request()">
        <v-input :label="'Nombre'"      v-model="data.course.name" />
        <v-input :label="'Descripción'" v-model="data.course.description" :textarea="true" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
