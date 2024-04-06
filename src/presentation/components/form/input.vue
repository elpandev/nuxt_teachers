<script setup lang="ts">
  import { nano_id } from '~/elpandev/utils';

  interface Props {
    label: string
    type?: string
    step?: string
    modelValue: any
    errors?: string[]
    prefix?: string
  }

  interface Emits {
    (e: 'update:modelValue', value: any): any
  }

  const id    = nano_id()
  const props = withDefaults(defineProps<Props>(), { type: 'text' })
  const emit  = defineEmits<Emits>()

  function on_input(event: any) {
    if (props.type == 'text') {
      let value = event.target.value as string

      if (props.prefix) {
        value = `${props.prefix}${value.replace(props.prefix, '')}`
      }

      return emit('update:modelValue', value)
    }

    const value = ['checkbox', 'radio'].includes(props.type) 
      ? event.target.checked
      : event.target.value

    emit('update:modelValue', value)
  }
</script>

<template>
  <div class="field" :class="{ [props.type]: true }">
    <label :for="id">{{ label }}</label>
    <input :id="id" :type="props.type" :value="modelValue" :checked="modelValue" @input="on_input" :step="step">
    <v-errors :errors="props.errors" />
  </div>
</template>
