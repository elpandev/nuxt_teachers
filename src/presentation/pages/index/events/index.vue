<template>
  <v-custom-header-primary :name="`Calendario`">
    <template #buttons>
      <nuxt-link to="/events/create" class="button solid text teal">Nuevo Evento</nuxt-link>
    </template>
  </v-custom-header-primary>

  <main class="x-events">
    <header class="container">
      <v-selector-arrow class="horizontal" v-model="option" :options="options" />
    </header>

    <v-calendar class="container" v-model="date" v-model:calendar_by_month="calendar_by_month" />

    <v-event v-for="event in events"
      :class="'container'"
      :key="event.id"
      :event="event"
    />
  </main>
</template>

<script setup lang="ts">
import { calentar_by_month_request, event_request } from '~/src/config/repositories';
import { CalendarByMonthFactory } from '~/src/modules/calendar_by_month/domain/factory';
import { CalendarByMonth } from '~/src/modules/calendar_by_month/domain/model';
import type { Event } from '~/src/modules/event/domain/model';
import { SelectOption } from '~/src/presentation/models/select_option';

const option            = ref<SelectOption<Date>>(generate_option_by_date(new Date()))
const options           = ref<SelectOption<Date>[]>(generate_options(new Date()))
const events            = ref<Event[]>([])
const date              = ref<Date>(new Date())
const calendar_by_month = ref<CalendarByMonth>(new CalendarByMonth())

function generate_option_by_date(_date: Date): SelectOption<Date> {
  return new SelectOption({
    id:    _date.format('YYYY-MM'),
    name:  _date.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' }),
    value: new Date(_date),
  })
}

function generate_options(_date: Date): SelectOption<Date>[] {
  const elements: SelectOption<Date>[] = []

  for (let index = 0; index < 5; index++) {
    const date = _date.add({ month: index - 2 })

    elements.push(generate_option_by_date(date))
  }

  elements.sort((a, b) => a.id.localeCompare(b.id))

  return elements
}

async function request_calendar_by_month(id: string) {
  return await calentar_by_month_request.get(id) ?? new CalendarByMonth({ id })
}

function watch_date(value: Date) {
  const record        = calendar_by_month.value.events.get(value.format('YYYY-MM-DD'))
  const record_events = record ? Array.from(record.values()) : []

  record_events.sort((a, b) => a.date_at.toISOString().localeCompare(b.date_at.toISOString()))

  events.value = record_events
}

watch(option, async (value) => {
  options          .value = generate_options(value.value)
  calendar_by_month.value = await request_calendar_by_month(value.value.format('YYYY-MM'))
})

watch(date, watch_date)

onMounted(async () => {
  calendar_by_month.value = await request_calendar_by_month(date.value.format('YYYY-MM'))

  watch_date(date.value)
})
</script>

<style lang="scss">
.x-events {
  > header {
    padding: 12px 21px;
  }
  .v-calendar {
    padding: 28px 24px;
  }
}
</style>
