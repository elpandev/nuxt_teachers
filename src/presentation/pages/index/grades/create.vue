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

  const props     = defineProps<{ grade_id?: string }>()
  const title     = `${ props.grade_id ? 'Editar' : 'Nueva' } Hoja de Calificaciones`
  const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
  const snackbar  = useSnackbar()
  const router    = useRouter()

  //#region course

  async function search_course(text: string): Promise<ISelectOption<Course>[]> {
    const data = await course_request.paginate(new CourseFilter({ name: text }))

    return data.map(e => e.toSelectOption())
  }


  async function search_category(name: string): Promise<ISelectOption<Category>[]> {
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

  const store = useRequest(async () => {
    try {
      console.log(data.value!.grade!)
      await grade_request.store(data.value!.grade!)

      snackbar.value.success(`La hoja de calificaciones "${data.value!.grade!.name}" ha sido creada`)

      router.push(`/grades/${data.value!.grade!.id}`)
    }

    catch (error) {
      if (error instanceof Validator) { validator.value = error }

      console.error(error)
    }
  })

  const { data, pending } = await useLazyAsyncData(nano_id(), async () => {
    const grade = props.grade_id
      ? await grade_request.get(props.grade_id)
      : new GradeFactory().generate()

    return { grade }
  })

  useSeoMeta({ title })
</script>

<template>
  <main v-if="!pending" class="create">
    <template v-if="data?.grade">
      <header class="container">
        <h1>{{ title }}</h1>
      </header>
      <form class="form" @submit.prevent="store.request()">
        <v-selector
          :model-value = "data.grade.course"
          :label       = "'Curso'"
          :request     = "search_course"
          :input       ="true"
          @update:model-value="(value) => data!.grade!.course = value"
        />

        <v-selector
          v-model  = "data.grade.category"
          :label   = "'Category'"
          :request = "search_category"
        />

        <v-form-input           v-model="data.grade.name"        :label="'Nombre'" />
        <v-form-text-area       v-model="data.grade.description" :label="'Descripción'" />

        <v-form-input-date-time v-model="data.grade.date_at"     :label="'Fecha'" />

        <v-loader v-if="store.pending.value" />
        <button v-else class="button outline text teal" type="submit">Guardar</button>
      </form>
    </template>
  </main>
  <v-loader v-else />
</template>
