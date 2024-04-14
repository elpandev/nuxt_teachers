<template>
  <main v-if="!pending" class="document">
    <template v-if="data">
      <template v-if="data.table">
        <div class="buttons">
          <button class="button download"><v-icon-download /> Descagar</button>
          <button class="button clone"><v-icon-duplicate /> Clonar</button>
          <button class="button clone" @click="column_modal.open()"><v-icon-add /> Columna</button>
          <nuxt-link class="button edit" :to="`/tables/${data.table.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
          <button class="button destroy"><v-icon-destroy /> Eliminar</button>
        </div>
  
        <header class="container">
          <h1>{{ data.table.name }}</h1>
          <p>{{ data.table.description }}</p>
        </header>
  
        <template v-if="data.course">
          <div class="container">
            <table class="table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th v-for="column in data.columns" :key="`thead-th-${column.id}`">{{ column.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in Object.values(data.course.students)" :key="`tr-${student.id}`">
                  <td>{{ student.name }}</td>
                  <td v-for="column in data.columns" :key="`tbody-td-${column.id}`">
                    <input v-if="column.is_text"   v-model="column.students[student.id]"        type="text">
                    <input v-if="column.is_number" v-model.number="column.students[student.id]" type="number">
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td v-for="column in data.columns" :key="`tfoot-td-${column.id}`">
                    <button class="button text solid teal" @click="store_column(column)">Guardar</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </template>

      <span v-else>La tabla no existe</span>
    </template>
  </main>
  <v-loader v-else />

  <Teleport to="body">
    <v-modal v-if="column_modal.enabled.value" @closed="column_modal.close()">
      <v-column-create
        :table_id="table_id"
        @stored="(column) => data?.columns.push(column)"
      />
    </v-modal>
  </Teleport>
</template>

<script setup lang="ts">
import { column_request, course_request, table_request } from '~/src/config/repositories';
import { ColumnFilter } from '~/src/modules/column/domain/filter';
import type { Column } from '~/src/modules/column/domain/model';
import { Course } from '~/src/modules/course/domain/model';

const route    = useRoute()
const table_id = route.params.table_id as string

const column_modal = useModal()

const { request: store_column } = useRequest(async (column: Column) => {
  await column_request.store(column)
})

const { data, pending } = await useLazyAsyncData(async () => {
  const table = await table_request.get(table_id)

  const [columns, course] = await Promise.all([
    column_request.paginate(new ColumnFilter({ table_id })),
    table ? course_request.get(table.course.id) : new Course(),
  ])

  return { table, columns, course }
})
</script>
