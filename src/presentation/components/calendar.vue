<template>
  <section class="v-calendar">
    <header>
      <span>Domingo</span>
      <span>Lunes</span>
      <span>Martes</span>
      <span>Miercoles</span>
      <span>Jueves</span>
      <span>Viernes</span>
      <span>Sábado</span>
    </header>

    <div class="body">
      <div v-for="date in dates_by_month" :key="date.toISOString()">
        <span>{{ date.getDate() }}</span>
        <ul>
          <li v-for="event in events_map.get(date.format('YYYY-MM-DD'))" :key="event.id"></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Event } from '~/src/modules/event/domain/model';

const props = defineProps<{
  events: Event[]
}>()

const model = defineModel<Date>({ default: new Date() })

const events_map     = ref<Map<string, Event[]>>(new Map())
const dates_by_month = ref<Date[]>([])

function generate_dates_by_month(_date: Date): Date[] {
  const dates: Date[] = []
  const first_date = _date.firstDateMonth().firstDateWeek()

  for (let index = -1; index < 34; index++) {
    dates.push(first_date.addDays(index))
  }

  return dates
}

function generate_events_map(_events: Event[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>()

  for (const event of _events) {
    const key = new Date(event.date_at).format('YYYY-MM-DD')

    if (!map.has(key)) map.set(key, [])
    
    map.get(key)!.push(event)
  }

  return map
}

onMounted(() => {
  events_map    .value = generate_events_map(props.events)
  dates_by_month.value = generate_dates_by_month(model.value)
})
</script>

<style lang="scss">
.v-calendar {
  display: grid;
  gap: 18px;
  > header, > .body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 18px;
    > div, > span {
      display: grid;
      place-items: center;
    }
  }
  > header {
    > span {
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--color-primary);
    }
  }
  > .body {
    > div {
      display: grid;
      gap: 4px;
      ul {
        display: flex;
        align-items: center;
        gap: 4px;
        height: 5px;
        li {
          width: 5px;
          height: 5px;
          border-radius: 100%;
          background-color: brown;
        }
      }
    }
  }
}
</style>
