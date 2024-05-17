<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { GradeFactory } from '~/src/modules/grade/domain/factory';
import { grade_request, course_request, category_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import { Course } from '~/src/modules/course/domain/model';
import type { ISelectOption } from '~/src/presentation/interfaces/select_option';
import { CourseFilter } from '~/src/modules/course/domain/filter';
import { CategoryFilter } from '~/src/modules/category/domain/filter';
import { CategoryTypeEnum, type Category } from '~/src/modules/category/domain/model';
import { OrderDirectionEnum } from '~/elpandev/hexagonal/base/domain/filter';
import type { SelectOption } from '~/src/presentation/models/select_option';
import { Grade } from '~/src/modules/grade/domain/model';

const props     = defineProps<{ grade_id?: string }>()
const title     = `${ props.grade_id ? 'Editar' : 'Nueva' } Hoja de Calificaciones`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()
const router    = useRouter()
const grade     = ref<Grade>(new Grade())

//#region course

const course_option = computed<SelectOption<Course>>({
  get() { return grade.value.course_select_option() },
  set(value) {
    grade.value.course_id   = value.id
    grade.value.course_name = value.name
  }
})

async function search_course(text: string): Promise<SelectOption<Course>[]> {
  const data = await course_request.paginate(new CourseFilter({ name: text }))

  return data.map(e => e.toSelectOption())
}

//#endregion
//#region category

const category_option = computed<SelectOption<Category>>({
  get() { return grade.value.category_select_option() },
  set(value) {
    grade.value.category_id   = value.id
    grade.value.category_name = value.name
  }
})

async function search_category(name: string): Promise<SelectOption<Category>[]> {
  const data = await category_request.paginate(new CategoryFilter({
    name: name,
    type: CategoryTypeEnum.GRADE,
    order: {
      path: 'name',
      direction: OrderDirectionEnum.ASC,
    }
  }))

  return data.map(e => e.toSelectOption())
}

//#endregion

async function request_grade() {
  grade.value = props.grade_id
    ? await grade_request.get(props.grade_id) ?? new Grade()
    : new GradeFactory().generate()
}

const { request: store, pending: store_pending } = useRequest(async () => {
  try {
    await grade_request.store(grade.value)

    snackbar.value.success(`La hoja de calificaciones "${grade.value.name}" ha sido creada`)

    router.push(`/grades/${grade.value.id}`)
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

const { pending } = await useLazyAsyncData(nano_id(), async () => {
  await request_grade()
})

useSeoMeta({ title })
</script>

<template>
  <main v-if="!pending" class="create">
    <header class="container">
      <h1>{{ title }}</h1>
    </header>

    <form class="form" @submit.prevent="store()">
      <v-selector
        v-model  = "course_option"
        :label   = "'Curso'"
        :request = "search_course"
        :input   = "true"
      />

      <v-selector
        v-model  = "category_option"
        :label   = "'Category'"
        :request = "search_category"
      />

      <v-input v-model="grade.name"        :label="'Nombre'"      :type="'text'" />
      <v-input v-model="grade.description" :label="'Descripción'" :type="'textarea'" />
      <v-input v-model="grade.date_at"     :label="'Fecha'"       :type="'datetime-local'" />

      <v-loader v-if="store_pending" />
      <button v-else class="button outline text teal" type="submit">Guardar</button>
    </form>
  </main>
  <v-loader v-else />
</template>
