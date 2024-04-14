<template>
  <form class="form" @submit.prevent="store()">
    <v-selector v-model="column_type_option" :label="'Tipo'" :options="column_type_options" />

    <v-input v-model="column.name"        :label="'Nombre'" />
    <v-input v-model="column.description" :label="'Descripción'" />

    <v-loader v-if="pending" />
    <button v-else class="button outline text teal" type="submit">Guardar</button>
  </form>
</template>

<script setup lang="ts">
import { column_request } from '~/src/config/repositories';
import { Column, ColumnTypeEnum, column_type_locale, column_type_options } from '~/src/modules/column/domain/model';
import { SelectOption } from '../models/select_option';

const props = defineProps<{
  column?: Column
  table_id: string
}>()

const emit = defineEmits<{
  (e: 'stored', value: Column): void
}>()

const column = ref<Column>(props.column ?? new Column())

const column_type_option = computed<SelectOption<ColumnTypeEnum>>({
  get() { return new SelectOption({ id: column.value.type, name: column_type_locale(column.value.type), value: column.value.type }) },
  set(option) { column.value.type = option.value }
})

const { request: store, pending } = useRequest(async () => {
  try {
    column.value.table_id = props.table_id

    await column_request.store(column.value)

    emit('stored', column.value)
  }

  catch (error) { throw error }
})
</script>
