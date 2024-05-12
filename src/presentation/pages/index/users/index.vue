<template>
  <v-custom-header-primary :name="`Usuarios (${users_count})`">
    <template #buttons>
      <nuxt-link to="/users/create" class="button solid text teal">Nuevo Usuario</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main class="documents">
    <div class="actions">
      <button class="action download"><v-icon-download /> Descagar</button>
      <button class="action search" :class="{ enabled: searcher_enabled }" @click="searcher_enabled = !searcher_enabled"><v-icon-search/></button>
    </div>

    <div v-if="searcher_enabled" class="container page-filter">
      <v-input v-model="filter.name" :placeholder="'Nombre'" />

      <button class="button solid text teal" @click="search()">Buscar</button>
    </div>

    <div class="container table-users-container">
      <table class="table">
        <thead>
          <tr>
            <th>Rol</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Cursos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user_role_locale(user.role) }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.courses_count }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/users/${user.id}`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/users/${user.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy(user.id)"><v-icon-destroy /> Eliminar</button>
              </v-popup-menu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import { user_request } from '~/src/config/repositories';
import { UserFilter } from '~/src/modules/user/domain/filter';
import { User, user_role_locale } from '~/src/modules/user/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar         = useSnackbar()
const filter           = new UserFilter()
const users            = ref<User[]>([])
const users_count      = ref<number>(0)
const searcher_enabled = ref<boolean>(false)

const { request: destroy } = useRequest(async (user_id: string) => {
  try {
    await user_request.destroy(user_id)

    users.value.removeWhere(user => user.id == user_id)

    snackbar.value.success(`El usuario ha sido eliminado`)
  }

  catch (error) {
    console.error(error)
  }
})

const { request: request_users } = useRequest(async () => {
  users.value = await user_request.paginate(filter)
})

const { request: request_users_count } = useRequest(async () => {
  users_count.value = await user_request.count(filter) as number
})

const { request: search } = useRequest(async () => {
  await Promise.all([
    request_users(),
    request_users_count(),
  ])
})

onMounted(search)
</script>
