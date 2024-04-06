<script setup lang="ts">
  import { grade_request } from '~/src/config/repositories';
  import { GradeRegister } from '~/src/modules/grade/domain/values/register';
  import { Student } from '~/src/modules/student/domain/model';
  import { useSnackbar } from '~/src/presentation/states/snackbar';

  const snackbar               = useSnackbar()
  const route                  = useRoute()
  const grade_id               = route.params.grade_id as string
  const modal_students_enabled = ref<boolean>(false)

  function show_students_modal() {
    modal_students_enabled.value = true
  }

  async function store_register(student: Student): Promise<void> {
    data.value!.grade!.store_register(new GradeRegister().fromStudent(student))
  }

  async function destroy_register(student: Student): Promise<void> {
    data.value!.grade!.destroy_register(new GradeRegister().fromStudent(student))
  }

  const store = useRequest(async () => {
    try {
      await grade_request.store(data.value!.grade!)
  
      snackbar.value.success(`La hoja de calificaciones ha sido actualizada`)
    }

    catch (error) {
      console.error(error)
    }
  })

  const destroy = useRequest(async () => {
    try {
      await grade_request.destroy(data.value!.grade!.id)

      data.value!.grade = undefined
  
      snackbar.value.success(`La hoja de calificaciones ha sido eliminado`)
    }

    catch (error) {
      console.error(error)
    }
  })

  const { data, pending } = await useLazyAsyncData(async () => {
    const grade = await grade_request.get(grade_id)

    return { grade }
  })
</script>

<template>
  <main v-if="!pending" class="document">
    <template v-if="data?.grade">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/grades/${data.grade.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy" @click="destroy.request()"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ data.grade.name }}</h1>
        <p>{{ data.grade.description }}</p>
        <p>{{ data.grade.course?.name }}</p>
      </header>

      <section class="registers container">
        <header>
          <h3>Estudiantes</h3>
          <button class="button share" @click="show_students_modal"><v-icon-add /></button>
        </header>

        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Calificación</th>
              <th>Comentario</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="register in data.grade.registers" :key="register.id">
              <td>
                <nuxt-link :to="`/students/${register.id}/grades`" style="text-decoration: underline;">{{ register.name }}</nuxt-link>
              </td>
              <td>
                <input v-model.number="register.score" type="number">
              </td>
              <td>
                <textarea v-model="register.comment" rows="1"></textarea>
              </td>
              <td class="actions">
                <v-popup-menu>
                  <button @click="destroy_register(register.toStudent())"><v-icon-destroy /> Eliminar</button>
                </v-popup-menu>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer class="container" style="display: grid;justify-content: end;">
        <button class="button text solid teal" @click="store.request()">Guardar</button>
      </footer>
    </template>
    <span v-else>Este registro de asistencias no existe</span>
  </main>
  <v-loader v-else />
  <teleport to="body">
    <v-custom-modal-attach-student
      v-if="modal_students_enabled"
      :students_attached="Object.keys(data?.grade?.registers ?? {})"
      @closed="modal_students_enabled = false"
      @attach="store_register"
      @detach="destroy_register"
    />
  </teleport>
</template>
