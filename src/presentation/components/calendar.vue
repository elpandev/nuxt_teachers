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
      <div v-for="date in calendar_by_month.dates"
        :key="date.toISOString()"
        :class="{
          current:  date.format('YYYY-MM') == calendar_by_month.date.format('YYYY-MM'),
          contains: calendar_by_month.events.has(date.format('YYYY-MM-DD')),
          enabled:  model.format('YYYY-MM-DD') == date.format('YYYY-MM-DD'),
        }"
      >
        <span @click="model = date">{{ date.getDate() }}</span>
        <ul>
          <v-message v-for="event in calendar_by_month.events.get(date.format('YYYY-MM-DD'))?.values()"
            :key="event.id"
            :is="'li'"
          >
            <template #message>
              <div>
                <h3>{{ event.name }}</h3>
                <p>{{ event.date_at.format('YYYY-MM-DD hh:mm') }}</p>
                <nuxt-link :to="`/events/${event.id}`">ver</nuxt-link>
              </div>
            </template>
          </v-message>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CalendarByMonth } from '~/src/modules/calendar_by_month/domain/model';

const model             = defineModel<Date>({ default: new Date() })
const calendar_by_month = defineModel<CalendarByMonth>('calendar_by_month',{ default: new CalendarByMonth() })
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
      position: relative;
      display: grid;
      gap: 4px;
      opacity: 0.4;
      > span {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        cursor: pointer;
        border-radius: 100%;
        &:hover {
          background-color: rgba($color_primary, $alpha: 0.12);
        }
      }
      ul {
        position: absolute;
        top: calc(100% + 6px);
        display: flex;
        align-items: center;
        gap: 4px;
        height: 5px;
        li {
          width: 5px;
          height: 5px;
          border-radius: 100%;
          background-color: $color_primary;
        }
      }
      &.current {
        opacity: 1;
      }
      &.contains {
        > span {
          background-color: #f7f7f7;
        }
      }
      &.enabled {
        > span {
          background-color: rgba($color_primary, $alpha: 0.64);
          color: white;
        }
      }
    }
  }
}
</style>
