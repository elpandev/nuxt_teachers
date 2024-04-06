<script setup lang="ts">
  type Props = {
    modelValue: string
  }

  type Emits = {
    (e: 'search'): any
    (e: 'update:modelValue', value: string): any
  }

  const props = defineProps<Props>()
  const emits = defineEmits<Emits>()
</script>

<template>
  <form @submit.prevent="emits('search')" class="searcher">
    <input type="text" :value="modelValue" @input="emits('update:modelValue', ($event.target as any).value)">
    <button><v-icon-search /></button>
  </form>
</template>

<style lang="scss">
.searcher {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 6px 6px 12px;
  width: 100%;
  max-width: 256px;
  input {
    border: none;
    padding: 0;
  }
  button {
    svg {
      width: 21px;
      height: 21px;
    }
  }
}
</style>
