<script setup lang="ts">
  import { nano_id } from '@/elpandev/utils/methods/nano_id';

  interface Props {
    label: string
    modelValue: Date
    errors?: string[]
  }

  interface Emits {
    (e: 'update:modelValue', value: Date): any
  }

  const id    = nano_id()
  const props = defineProps<Props>()
  const emit  = defineEmits<Emits>()

  function on_input(event: any) {
    const value = event.target.value as string

    emit('update:modelValue', new Date(value))
  }
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input :id="id" :type="'datetime-local'" :value="new Date(modelValue).toInput()" @input="on_input" >
    <v-errors :errors="props.errors" />
  </div>
</template>
