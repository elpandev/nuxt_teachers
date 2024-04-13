<template>
  <v-custom-header-primary :name="`Calendario`">
    <template #buttons>
      <nuxt-link to="/events/create" class="button solid text teal">Nuevo Evento</nuxt-link>
    </template>
  </v-custom-header-primary>

  <template v-if="!pending">
    <main class="x-events">
      <header>
        <input type="month" :value="date.format('YYYY-MM')" @change="on_change_date_input">
      </header>
  
      <v-calendar
        :model-value="date"
        :key="date.format('YYYY-MM')"
        :events="data?.events ?? []"
      />
  
      <footer>
  
      </footer>
    </main>

    <aside>
  
    </aside>
  </template>

  <v-loader v-else />
</template>

<script setup lang="ts">
import { event_request } from '~/src/config/repositories';

const date = ref<Date>(new Date())

function on_change_date_input(event: any) {
  const [year, month] = event.target.value.split('-')

  date.value = date.value.replace({ year, month })
}

const { data, pending } = await useLazyAsyncData(async () => {
  const [events, count] = await Promise.all([
    event_request.paginate(),
    event_request.count(),
  ])

  return { events, count }
})

</script>

<style lang="scss">
main.x-events {
  display: grid;
  gap: 36px;
  .controller {
    .v-selector-arrow {
      width: 128px;
    }
  }
}

aside.x-events {

}
</style>
