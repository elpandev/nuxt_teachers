<template>
  <v-custom-header-primary :name="`Estudiantes (${ data?.count })`">
    <template #buttons>
      <nuxt-link to="/tables/create" class="button solid text teal">Nueva Tabla</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main class="documents">
    <div class="buttons">
      <button class="button filter"   :class="{ enabled: filter.enabled }" @click="filter_enabled = !filter_enabled"><v-icon-filter /> Filtrar</button>
      <button class="button download" :class="{ enabled: filter.enabled }"><v-icon-download /> Exportar</button>
      <button class="button download" :class="{ enabled: filter.enabled }"><v-icon-download /> Importar</button>
    </div>

    <template v-if="filter_enabled">
      <div class="container filters">
        <v-input
          v-model="filter.name"
          :type="'text'"
          :label="'Nombre'"
          :placeholder="'nombre...'"
          @update:model-value="search_by_input()"
        />
      </div>
    </template>

    <div class="container">
      <table v-if="!pending" class="table">
        <thead>
          <tr>
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Nombre'"
              :path    = "'name'"
              @update:model-value="search_by_order"
            />
            <th>Curso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="table in data?.tables" :key="table.id">
            <td>{{ table.name }}</td>
            <td>{{ table.course.name }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/tables/${table.id}`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/tables/${table.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy.request(table.id)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <v-loader v-else />
    </div>
  </main>
</template>

<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { table_request } from '~/src/config/repositories';
import { TableFilter } from '~/src/modules/table/domain/filter';
import { TableEnum } from '~/src/presentation/enums/tables';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar       = useSnackbar()
const filter         = reactive(new TableFilter({ order: { path: 'name', direction: OrderDirectionEnum.ASC } }))
const filter_enabled = ref<boolean>(false)

const destroy = useRequest(async (table_id: string) => {
  try {
    await table_request.destroy(table_id)

    data.value?.tables.removeWhere(table => table.id == table_id)

    snackbar.value.success(`El estudiante ha sido eliminado`)
  }

  catch (error) {
    console.error(error)
  }
})

async function request_data() {
  const [tables, count] = await Promise.all([
    table_request.paginate(filter),
    table_request.count   (filter),
  ])

  return { tables, count }
}

async function search_by_input() {
  filter.order = filter.enabled
    ? undefined
    : { path: 'name', direction: OrderDirectionEnum.ASC }

  data.value = await Promise.debounce(request_data, 1500, TableEnum.TABLES)
}

async function search_by_order() {
  if (filter.order == undefined) {
    filter.order = {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }

  data.value = await request_data()
}

const { data, pending } = await useLazyAsyncData(request_data)
</script>
