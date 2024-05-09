<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { CategoryFactory } from '~/src/modules/category/domain/factory';
import { category_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { CategoryTypeEnum, category_type_locale, category_type_options } from '~/src/modules/category/domain/model';
import { SelectOption } from '~/src/presentation/models/select_option';

const props     = defineProps<{ category_id?: string }>()
const title     = `${ props.category_id ? 'Editar' : 'Nueva' } Categoría`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()

const category_type_option = computed<SelectOption<CategoryTypeEnum>>({
  get() { return new SelectOption({ id: data.value!.category!.type, name: category_type_locale(data.value!.category!.type), value: data.value!.category!.type }) },
  set(option) { data.value!.category!.type = option.value }
})

const store = useRequest(async () => {
  try {
    props.category_id === undefined
      ? await category_request.store (data.value!.category!)
      : await category_request.update(props.category_id, data.value!.category!)

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
        <template v-if="$props.category_id === undefined">
          <v-selector v-model="category_type_option" :label="'Tipo'" :options="category_type_options" />
        </template>

        <v-form-input v-model="data.category.name"        :label="'Nombre'" />
        <v-form-input v-model="data.category.description" :label="'Descripción'" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
