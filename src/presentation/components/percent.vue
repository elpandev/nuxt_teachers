<template>
  <v-message :is="'div'" class="v-percent">
    <template #element>
      <span class="bar" :style="{ width: `${percent.toFixed(2)}%` }"></span>
      <span class="value">{{ props.value.toFixed(props.decimals) }}</span>
      <span class="name">{{ props.name }}</span>
      <span class="percent">{{ percent.toFixed(1) }}%</span>
    </template>
    <template #message>
      promedio: {{ props.average.toFixed(2)  }}
    </template>
  </v-message>
</template>

<script setup lang="ts">
interface IProps {
  name: string
  value: number
  max: number
  average?: number
  decimals: number
}

const props = withDefaults(defineProps<IProps>(), {
  average: 0,
  decimals: 0,
})

const percent = computed<number>(() => {
  if (props.max == 0) return 0

  return (props.value * 100) / props.max
})

const average = computed<number>(() => {
  if (props.max == 0) return 0

  return (props.average * 100) / props.max
})
</script>

<style lang="scss">
.v-percent {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 4px;
  position: relative;
  padding: 4px 12px;
  border-radius: 9px;
  align-items: center;
  background-color: rgba($color_primary, 0.12);
  .bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 9px;
    transition: 0.64s;
    background-color: rgba($color_primary, 0.18);
  }
  .value, .name, .percent, .average {
    position: relative;
    z-index: 1;
  }
  .percent {
    font-size: 14px;
  }
  .average {
    position: absolute;
    top: -3px;
    bottom: -3px;
    width: 5px;
    box-shadow: 0 1px 3px #aaa;
  }
  &.status-present {
    background-color: rgba($color_status_present, 0.12);
    .bar {
      background-color: rgba($color_status_present, 0.18);
    }
  }
  &.status-late {
    background-color: rgba($color_status_late, 0.12);
    .bar {
      background-color: rgba($color_status_late, 0.18);
    }
  }
  &.status-absent {
    background-color: rgba($color_status_absent, 0.12);
    .bar {
      background-color: rgba($color_status_absent, 0.18);
    }
  }
  &.status-expelled {
    background-color: rgba($color_status_expelled, 0.12);
    .bar {
      background-color: rgba($color_status_expelled, 0.18);
    }
  }
}
</style>
