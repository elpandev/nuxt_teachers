<template>
  <v-custom-header-primary :name="title" />

  <main v-if="!pending" class="create">
    <template v-if="data?.table">
      <form class="form" @submit.prevent="store.request()">
        <v-selector v-model="course_option" :label="'Curso'" :placeholder="'Curso'" :request="search_course" />

        <v-input :label="'Nombre'"      v-model="data.table.name" />
        <v-input :label="'Descripción'" v-model="data.table.description" :textarea="true" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>

<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { TableFactory } from '~/src/modules/table/domain/factory';
import { course_request, table_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import type { SelectOption } from '~/src/presentation/models/select_option';
import type { Course } from '~/src/modules/course/domain/model';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';

const props     = defineProps<{ table_id?: string }>()
const title     = `${ props.table_id ? 'Editar' : 'Nueva' } Tabla`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()

const course_option = computed<SelectOption<Course>>({
  get() { return data.value!.table!.course.toSelectOption() },
  set(option) { data.value!.table!.course = option.value }
})

async function search_course(name: string): Promise<SelectOption<Course>[]> {
  const data = await course_request.paginate(new CourseFilter({
    name: name,
    order: {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }))

  return data.map(e => e.toSelectOption())
}

const store = useRequest(async () => {
  try {
    await table_request.store(data.value!.table!)

    snackbar.value.success(`La tabla "${data.value!.table!.name}" ha sido creada`)
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
  const table = props.table_id
    ? await table_request.get(props.table_id)
    : new TableFactory().generate()

  return { table }
})

useSeoMeta({ title })
</script>
