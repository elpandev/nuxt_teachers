<script setup lang="ts">
  import { attendance_request } from '~/src/config/repositories';
  import { AttendanceRegister, AttendanceRegisterStatusEnum, attendance_register_status_locale, attendance_register_status_options } from '~/src/modules/attendance/domain/values/register';
  import { Student } from '~/src/modules/student/domain/model';
  import { useSnackbar } from '~/src/presentation/states/snackbar';

  const snackbar               = useSnackbar()
  const route                  = useRoute()
  const attendance_id          = route.params.attendance_id as string
  const modal_students_enabled = ref<boolean>(false)

  function show_students_modal() {
    modal_students_enabled.value = true
  }

  async function store_register(student: Student): Promise<void> {
    data.value!.attendance!.store_register(new AttendanceRegister().fromStudent(student))
  }

  async function destroy_register(student: Student): Promise<void> {
    data.value!.attendance!.destroy_register(new AttendanceRegister().fromStudent(student))
  }

  async function update_register_status(student_id: string, status: AttendanceRegisterStatusEnum): Promise<void> {
    data.value!.attendance!.update_register_status(student_id, status)
  }

  const store = useRequest(async () => {
    try {
      await attendance_request.store(data.value!.attendance!)
  
      snackbar.value.success(`La hoja de asistencias ha sido actualizada`)
    }

    catch (error) {
      console.error(error)
    }
  })

  const destroy = useRequest(async () => {
    try {
      await attendance_request.destroy(data.value!.attendance!.id)

      data.value!.attendance = undefined
  
      snackbar.value.success(`La hoja de asistencias ha sido eliminada`)
    }

    catch (error) {
      console.error(error)
    }
  })

  const { data, pending } = await useLazyAsyncData(async () => {
    const attendance = await attendance_request.get(attendance_id)

    return { attendance }
  })

  const registers = computed<AttendanceRegister[]>(() => {
    try {
      if (data.value?.attendance == undefined) { return [] }

      const registers = Object.values(data.value.attendance.registers)

      registers.sort((a, b) => a.name.localeCompare(b.name))

      return registers
    }
    
    catch (error) { console.error(error) }

    return []
  })
</script>

<template>
  <main v-if="!pending" class="document">
    <template v-if="data?.attendance">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/attendances/${data.attendance.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy" @click="destroy.request()"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ data.attendance.name }}</h1>
        <p>{{ data.attendance.description }}</p>
        <p>{{ data.attendance.course?.name }}</p>
      </header>

      <div class="percents">
        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="data.attendance.present_names.length"
              :name="'Presente'"
              :amount="data.attendance.present_names.length"
              :total="data.attendance.registers_count"
              :color="'red'"
            />
          </template>
        </v-message>

        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="data.attendance.late_names.length"
              :name="'Tarde'"
              :amount="data.attendance.late_names.length"
              :total="data.attendance.registers_count"
              :color="'red'"
            />
          </template>
        </v-message>

        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="data.attendance.absent_names.length"
              :name="'Ausente'"
              :amount="data.attendance.absent_names.length"
              :total="data.attendance.registers_count"
              :color="'red'"
            />
          </template>
        </v-message>

        <v-message>
          <template #message>
            asdasdasd
          </template>
          <template #element>
            <v-box-percent
              :key="data.attendance.expelled_names.length"
              :name="'Expulsado'"
              :amount="data.attendance.expelled_names.length"
              :total="data.attendance.registers_count"
              :color="'red'"
            />
          </template>
        </v-message>
      </div>

      <section class="registers container">
        <header>
          <h3>Estudiantes</h3>
          <button class="button share" @click="show_students_modal"><v-icon-add /></button>
        </header>

        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Comentario</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="register in registers" :key="register.id">
              <td>
                <nuxt-link :to="`/students/${register.id}/attendances`" style="text-decoration: underline;">{{ register.name }}</nuxt-link>
              </td>
              <td>
                <select @input="(event) => update_register_status(register.id, (event.target as any).value)">
                  <option
                    v-for="status in Object.values(AttendanceRegisterStatusEnum)"
                    :key="`${register.id}${status}`"
                    :value="status"
                    :selected="register.status == status"
                  >
                    {{ attendance_register_status_locale(status) }}
                  </option>
                </select>
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
      :students_attached="Object.keys(data?.attendance?.registers ?? {})"
      @closed="modal_students_enabled = false"
      @attach="store_register"
      @detach="destroy_register"
    />
  </teleport>
</template>
