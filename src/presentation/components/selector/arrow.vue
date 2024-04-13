<template>
  <div class="v-selector-arrow">
    <button><v-icon-navigate-before @click="prev()" /></button>
    <span>{{ option.name }}</span>
    <button><v-icon-navigate-next @click="next()"/></button>
  </div>
</template>

<script setup lang="ts" generic="T">
import { SelectOption } from '../../models/select_option';

const props = defineProps<{
  initial: SelectOption<T>
  options: SelectOption<T>[]
}>()

const emit = defineEmits<{
  (e: 'change', value: T): void
}>()

const option = ref<SelectOption<T>>(props.initial)
const index  = ref<number>(props.options.findIndex(option => option.value == props.initial.value))

function prev() {
  if (index.value > 0) index.value--
}

function next() {
  if (index.value < props.options.length - 1) index.value++
}

watch(index, (value) => {
  option.value = props.options[value] as any

  emit('change', option.value.value as T)
})
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
}
</style>
