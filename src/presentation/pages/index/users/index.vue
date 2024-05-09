<template>
  <main v-if="!pending" class="documents">
    <header>
      <h1>{{ users_count }} Usuarios</h1>
      <NuxtLink to="users/create" class="button teal">Nuevo Usuario</NuxtLink>
    </header>
    <div class="table-container">
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
  <v-loader v-else />
</template>

<script setup lang="ts">
import { user_request } from '~/src/config/repositories';
import { UserFilter } from '~/src/modules/user/domain/filter';
import { User, user_role_locale } from '~/src/modules/user/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar    = useSnackbar()
const filter      = new UserFilter()
const users       = ref<User[]>([])
const users_count = ref<number>(0)

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

const { data, pending } = await useLazyAsyncData(async () => {
  await Promise.all([
    request_users(),
    request_users_count(),
  ])
})
</script>
