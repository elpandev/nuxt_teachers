<script setup lang="ts">
  import { Validator } from '@/elpandev/validator';
  import { nano_id } from "@/elpandev/utils/methods/nano_id";
  import { CategoryFactory } from '~/src/modules/category/domain/factory';
  import { category_request } from '~/src/config/repositories';
  import { useSnackbar } from '~/src/presentation/states/snackbar';
import { category_type_options } from '~/src/modules/category/domain/model';

  const props     = defineProps<{ category_id?: string }>()
  const title     = `${ props.category_id ? 'Editar' : 'Nueva' } Categoría`
  const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
  const snackbar  = useSnackbar()

  const store = useRequest(async () => {
    try {
      await category_request.store(data.value!.category!)

      snackbar.value.success(`La categoría "${data.value!.category!.name}" ha sido creada`)

      data.value!.category = new CategoryFactory().generate()
    }

    catch (error) {
      if (error instanceof Validator) { validator.value = error }

      console.error(error)
    }
  })

  const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
    const category = props.category_id
      ? await category_request.get(props.category_id)
      : new CategoryFactory().generate()

    return { category }
  })

  useSeoMeta({ title })
</script>

<template>
  <v-custom-header-primary :name="title" />

  <main v-if="!pending" class="create">
    <template v-if="data?.category">
      <form class="form" @submit.prevent="store.request()">
        <v-selector v-model="data.category.type" :label="'Tipo'" :options="category_type_options" />

        <v-form-input v-model="data.category.name"        :label="'Nombre'" />
        <v-form-input v-model="data.category.description" :label="'Descripción'" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
