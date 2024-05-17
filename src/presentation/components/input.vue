<script setup lang="ts">
  import { nano_id } from '@/elpandev/utils/methods/nano_id';

  interface Props {
    label?: string
    type?: 'text'|'number'|'datetime-local'|'password'
    step?: number
    errors?: string[]
    placeholder?: string
    textarea?: boolean
  }

  const id    = nano_id()
  const props = withDefaults(defineProps<Props>(), { type: 'text' })
  const model = defineModel({ required: true })

  const value = computed<string>({
    get() {
      if (typeof model.value == 'number') return `${model.value}`
      if (model.value instanceof Date)    return model.value.toInput()

      return model.value as string
    },
    set(value: string) {
      if (props.type == 'text')           model.value = value
      if (props.type == 'number')         model.value = parseFloat(`${value}`)
      if (props.type == 'datetime-local') model.value = new Date(value)
    }
  })
</script>

<template>
  <div class="input">
    <label v-if="label" :for="id">{{ label }}</label>

    <textarea v-if="textarea"
      v-model="value"
      :id="id"
      :placeholder="placeholder"
    ></textarea>

    <input v-else
      v-model="value"
      :id="id"
      :type="type"
      :step="step"
      :placeholder="placeholder"
    >

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
