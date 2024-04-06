<script setup lang="ts">
  import { TableColumn, table_column_type_options } from '~/src/modules/table/domain/values/column';

  interface IProps {
    column: TableColumn,
  }

  interface IEmits {
    (e: 'store:column', value: TableColumn): any
  }

  const props  = defineProps<IProps>()
  const emits  = defineEmits<IEmits>()
  const column = ref<TableColumn>(props.column.copyWith())

  function store() {
    try {
      emits('store:column', column.value)
    }

    catch (error) {
      console.error(error)
    }
  }
</script>

<template>
  <form class="form table-column" @submit.prevent="store()">
    <v-form-input  v-model="column.id" :label="'Código'" :prefix="'C'" />
    <v-form-input  v-model="column.name" :label="'Nombre'" />
    <v-selector v-model="column.type" :label="'Tipo'" :options ="table_column_type_options" />
    
    <template v-if="column.is_formula && column.formula">
      <v-form-input v-model="column.formula.formula" :label="'Formula'" />
    </template>

    <button class="button outline text teal" type="submit">Guardar</button>
  </form>
</template>

<style lang="scss">
.form.table-column {
  padding: 24px;
}
</style>
