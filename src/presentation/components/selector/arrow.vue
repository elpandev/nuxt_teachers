<template>
  <div class="v-selector-arrow">
    <button :class="{ enabled: prev_enabled }"><v-icon-navigate-before @click="prev()" /></button>
    <span>{{ option.name }}</span>
    <button :class="{ enabled: next_enabled }"><v-icon-navigate-next @click="next()"/></button>
  </div>
</template>

<script setup lang="ts" generic="T">
import { SelectOption } from '../../models/select_option';

const props = defineProps<{
  options: SelectOption<T>[]
}>()

const option = defineModel<SelectOption<T>>({ required: true })

const prev_enabled = computed<boolean>(() => {
  const index = props.options.findIndex(e => e.id == option.value.id)

  return (index - 1) >= 0
})

const next_enabled = computed<boolean>(() => {
  const index = props.options.findIndex(e => e.id == option.value.id)

  return (index + 1) < props.options.length - 1
})

function prev() {
  if (prev_enabled.value) {
    const index = props.options.findIndex(e => e.id == option.value.id)

    option.value = props.options[index - 1]
  }
}

function next() {
  if (next_enabled.value) {
    const index = props.options.findIndex(e => e.id == option.value.id)
  
    option.value = props.options[index + 1]
  }
}
</script>

<style lang="scss">
.v-selector-arrow {
  display: grid;
  &.horizontal {
    grid-template-columns: auto 1fr auto;
    gap: 4px;
  }
  &.vertical {

  }
  span {
    text-align: center;
  }
  button {
    opacity: 0.2;
    &.enabled {
      opacity: 1;
    }
  }
}
</style>
