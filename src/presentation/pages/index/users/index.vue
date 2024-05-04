<template>
  <main v-if="!pending" class="documents">
    <header>
      <h1>{{ data?.count }} Usuarios</h1>
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
          <tr v-for="user in data?.users" :key="user.id">
            <td>{{ user_role_locale(user.role) }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.courses_count }}</td>
            <td class="actions">
              <v-popup-menu>
                <nuxt-link :to="`/users/${user.id}`"><v-icon-visibility /> Ver</nuxt-link>
                <nuxt-link :to="`/users/${user.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
                <button @click="destroy.request(user.id)"><v-icon-destroy /> Eliminar</button>
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
import { user_role_locale } from '~/src/modules/user/domain/model';
import { useSnackbar } from '~/src/presentation/states/snackbar';

const snackbar = useSnackbar()

const destroy = useRequest(async (user_id: string) => {
  try {
    await user_request.destroy(user_id)

    data.value?.users.removeWhere(user => user.id == user_id)

    snackbar.value.success(`El usuario ha sido eliminado`)
  }

  catch (error) {
    console.error(error)
  }
})

const { data, pending } = await useLazyAsyncData(async () => {
  const filter = new UserFilter()

  const [users, count] = await Promise.all([
    user_request.paginate  (filter),
    user_request.count(filter),
  ])

  return { users, count }
})
</script>
