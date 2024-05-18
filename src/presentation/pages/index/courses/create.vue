<script setup lang="ts">
import { Validator } from '@/elpandev/validator';
import { nano_id } from "@/elpandev/utils/methods/nano_id";
import { CourseFactory } from '~/src/modules/course/domain/factory';
import { course_request, user_request } from '~/src/config/repositories';
import { useSnackbar } from '~/src/presentation/states/snackbar';
import type { SelectOption } from '~/src/presentation/models/select_option';
import { User, UserRoleEnum } from '~/src/modules/user/domain/model';
import { Course } from '~/src/modules/course/domain/model';
import { UserFilter } from '~/src/modules/user/domain/filter';

const router    = useRouter()
const props     = defineProps<{ course_id?: string }>()
const title     = `${ props.course_id ? 'Editar' : 'Nuevo' } Curso`
const validator = ref<Validator>(new Validator({ payload: {}, rules: {} }))
const snackbar  = useSnackbar()
const course    = ref<Course>(new Course())

const teacher_option = computed<SelectOption<User>>({
  get() {
    const teacher = new User({
      id:   course.value.teacher_id   ?? '',
      name: course.value.teacher_name ?? '',
    })

    return teacher.toSelectOption()
  },
  set(value) {
    course.value.teacher_id   = value.id
    course.value.teacher_name = value.name
  }
})

async function request_teacher_options(): Promise<SelectOption<User>[]> {
  const teachers = await user_request
    .paginate(new UserFilter({ roles: [UserRoleEnum.TEACHER] }))

  return teachers.map(e => e.toSelectOption())
}

const { request: request_course } = useRequest(async () => {
  course.value = props.course_id
    ? await course_request.get(props.course_id) ?? new Course()
    : new CourseFactory().generate()
})

const { request: store, pending: store_pending } = useRequest(async () => {
  try {
    props.course_id
      ? await course_request.update(props.course_id, course.value.toPayload())
      : await course_request.store(course.value)

    snackbar.value.success(`El curso "${course.value.name}" ha sido creado`)

    router.push(`/courses/${course.value.id}/users`)
  }

  catch (error) {
    if (error instanceof Validator) { validator.value = error }

    console.error(error)
  }
})

await useLazyAsyncData(nano_id(), async () => {
  await request_course()
})

useSeoMeta({ title })
</script>

<template>
  <v-custom-header-primary :name="title" />

  <main class="create">
    <form class="form" @submit.prevent="store()">
      <v-selector
        v-model="teacher_option"
        :request="request_teacher_options"
        :label="'Profesor'"
      />

      <v-input :label="'Nombre'"      v-model="course.name" />
      <v-input :label="'Descripción'" v-model="course.description" :textarea="true" />

      <v-loader v-if="store_pending" />
      <button v-else class="button outline text teal" type="submit">Guardar</button>
    </form>
  </main>
</template>
