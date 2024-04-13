<template>
  <article class="v-event">
    <span><v-icon-schedule />{{ new Date(event.date_at).format(`YYYY-MM-DD hh:mm`) }}</span>

    <header>
      <h3>{{ event.name }}</h3>
      <p>{{ event.description }}</p>
    </header>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '~/src/modules/event/domain/model';

defineProps<{ event: Event }>()
</script>

<style lang="scss">
.v-event {
  display: grid;
  gap: 9px;
  padding: 18px 21px;
  > span {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 6px;
    align-items: center;
    color: #aaa;
    font-size: 13px;
    line-height: 1;
    svg {
      width: 15px;
      height: 15px;
      fill: #aaa;
    }
  }
  > header {
    h3 {
      font-weight: 500;
    }
    p {
      font-size: 14px;
      color: #aaa;
    }
  }
}
</style>
