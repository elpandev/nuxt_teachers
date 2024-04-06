<script setup lang="ts">
  import { student_request } from '~/src/config/repositories';

  const route     = useRoute()
  const student_id = route.params.student_id as string

  const { data, pending } = await useLazyAsyncData(async () => {
    const [student] = await Promise.all([
      student_request.get(student_id),
    ])

    return { student }
  })
</script>

<template>
  <v-custom-header-primary :name="data?.student?.name ?? ''" />

  <main v-if="!pending" class="document">
    <template v-if="data?.student">
      <div class="buttons">
        <button class="button share"><v-icon-link /> Compartir</button>
        <button class="button download"><v-icon-download /> Descagar</button>
        <button class="button clone"><v-icon-duplicate /> Clonar</button>
        <nuxt-link class="button edit" :to="`/students/${data.student.id}/edit`"><v-icon-edit /> Editar</nuxt-link>
        <button class="button destroy"><v-icon-destroy /> Eliminar</button>
      </div>

      <header class="container">
        <h1>{{ data.student.name }}</h1>
        <p>{{ data.student.email }}</p>
      </header>

      <nav class="container">
        <nuxt-link :to="`/students/${student_id}/resume`">resume</nuxt-link>
        <nuxt-link :to="`/students/${student_id}/attendances`">attendances</nuxt-link>
        <nuxt-link :to="`/students/${student_id}/grades`">grades</nuxt-link>
      </nav>

      <nuxt-page :student="data.student" />
    </template>
    <span v-else>El estudiante no existe</span>
  </main>
  <v-loader v-else />
</template>

<style lang="scss">
.attendances {
  > .percents {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
    justify-content: space-between;
    gap: 24px;
    > .v-message {
      &:hover {
        > .v-box-percent {
          box-shadow: 0 1px 4px 0 #bbb;
        }
      }
    }
  }
}
</style>
