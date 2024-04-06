<script setup lang="ts">
  import { nano_id } from '@/elpandev/utils/methods/nano_id';

  interface Props {
    label: string
    modelValue: any
    errors?: string[]
  }

  interface Emits {
    (e: 'update:modelValue', value: any): any
  }

  const id    = nano_id()
  const props = defineProps<Props>();
  const emit  = defineEmits<Emits>()
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <textarea :id="id" :value="modelValue" @input="emit('update:modelValue', ($event.target as any).value)"></textarea>
    <v-errors :errors="props.errors" />
  </div>
</template>
