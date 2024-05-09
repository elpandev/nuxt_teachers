<script setup lang="ts">
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { category_request } from '~/src/config/repositories';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { category_type_options } from '~/src/modules/category/domain/model';
import { TableEnum } from '~/src/presentation/enums/tables';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar       = useSnackbar()
const filter         = reactive(new CategoryFilter({ order: { path: 'name', direction: OrderDirectionEnum.ASC } }))
const filter_enabled = ref<boolean>(false)

const destroy = useRequest(async (category_id: string) => {
  try {
    await category_request.destroy(category_id)

    data.value?.categories.removeWhere(category => category.id == category_id)

    snackbar.value.success(`El estudiante ha sido eliminado`)
  }

  catch (error) {
    console.error(error)
  }
})

async function request_data() {
  const [categories] = await Promise.all([
    category_request.paginate(filter),
    // category_request.count   (filter),
  ])

  return { categories, count: 0 }
}

async function search_by_input() {
  filter.order = filter.enabled
    ? undefined
    : { path: 'name', direction: OrderDirectionEnum.ASC }

  data.value = await Promise.debounce(request_data, 1500, TableEnum.CATEGORIES)
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

<template>
  <v-custom-header-primary :name="`Estudiantes (${ data?.count })`">
    <template #buttons>
      <nuxt-link to="categories/create" class="button solid text teal">Nuevo Estudiante</nuxt-link>
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
        
        <v-selector
          v-model="filter.type"
          :options="category_type_options"
          :label="'Tipo'"
          :placeholder="'tipo...'"
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
            <v-th-orderable
              v-model  = "filter.order"
              :name    = "'Tipo'"
              :path    = "'type'"
              @update:model-value="search_by_order"
            />
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in data?.categories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>{{ category.type }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/categories/${category.id}`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/categories/${category.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy.request(category.id)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <v-loader v-else />
    </div>
  </main>
</template>
