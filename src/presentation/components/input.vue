<script setup lang="ts">
  import { nano_id } from '@/elpandev/utils/methods/nano_id';

  interface Props {
    label?: string
    type?: 'text'|'number'|'datetime-local'
    step?: number
    modelValue: any
    errors?: string[]
    prefix?: string
    placeholder?: string
    textarea?: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: any): any
  }

  const id    = nano_id()
  const props = withDefaults(defineProps<Props>(), { type: 'text' })
  const emit  = defineEmits<Emits>()

  function on_input(event: any) {
    let value = event.target.value as string

    if (props.prefix) {
      value = `${props.prefix}${value.replace(props.prefix, '')}`
    }

    return emit('update:modelValue', value)
  }
</script>

<template>
  <div class="input">
    <label v-if="label" :for="id">{{ label }}</label>

    <textarea
      v-if="textarea"
      :id="id"
      :value="modelValue"
      @input="on_input"
      :placeholder="placeholder"
    ></textarea>

    <input v-else :id="id" :type="type" :value="modelValue" @input="on_input" :step="step" :placeholder="placeholder">

    <v-errors :errors="errors" />
  </div>
</template>

<style lang="scss">
.input {
  display: grid;
  gap: 4px;
  label {
    text-indent: 2px;
  }
}
</style>
