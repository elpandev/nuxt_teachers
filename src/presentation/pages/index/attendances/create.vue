<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { AttendanceFactory } from '~/src/modules/attendance/domain/factory';
import { attendance_request, category_request, course_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { Course } from '~/src/modules/course/domain/model';
import type { ISelectOption } from '~/src/presentation/interfaces/select_option';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import { CategoryTypeEnum, type Category } from '~/src/modules/category/domain/model';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { SelectOption } from '~/src/presentation/models/select_option';

const props     = defineProps<{ attendance_id?: string }>()
const title     = `${ props.attendance_id ? 'Editar' : 'Nueva' } Hoja de Asistencias`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()
const router    = useRouter()

const course_option = computed<SelectOption<Course>>({
  get() { return data.value!.attendance!.course_select_option() },
  set(value: SelectOption<Course>) {
    data.value!.attendance!.course_id   = value.id
    data.value!.attendance!.course_name = value.name
  }
})

const category_option = computed<SelectOption<Category>>({
  get() { return data.value!.attendance!.category_select_option() },
  set(value: SelectOption<Category>) {
    data.value!.attendance!.category_id   = value.id
    data.value!.attendance!.category_name = value.name
  }
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

async function search_category(name: string): Promise<SelectOption<Category>[]> {
  const data = await category_request.paginate(new CategoryFilter({
    name: name,
    type: CategoryTypeEnum.ATTENDANCE,
    order: {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }))

  return data.map(e => e.toSelectOption())
}

const store = useRequest(async () => {
  try {
    await attendance_request.store(data.value!.attendance!)

    snackbar.value.success(`La hoja de asistencia "${data.value!.attendance!.name}" ha sido creada`)

    router.push(`/attendances/${data.value!.attendance!.id}`)
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
  const attendance = props.attendance_id
    ? await attendance_request.get(props.attendance_id)
    : new AttendanceFactory().generate()

  return { attendance }
})

useSeoMeta({ title })
</script>

<template>
  <main v-if="!pending" class="create">
    <template v-if="data?.attendance">
      <header class="container">
        <h1>{{ title }}</h1>
      </header>
      <form class="form" @submit.prevent="store.request()">
        <template v-if="!data.attendance.exists">
          <v-selector
            v-model="course_option"
            :label   = "'Curso'"
            :request = "search_course"
          />
        </template>

        <v-selector
          v-model="category_option"
          :label   = "'Categoría'"
          :request = "search_category"
        />

        <v-input v-model="data.attendance.name"        :label="'Nombre'" />
        <v-input v-model="data.attendance.description" :label="'Descripción'" />

        <!-- <v-form-input-date-time v-model="data.attendance.date_at" :label="'Fecha'" /> -->

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
