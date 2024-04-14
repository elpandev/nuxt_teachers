<script setup lang="ts" generic="T">
  import { nano_id } from '@/elpandev/utils/methods/nano_id';
  import { SelectOption } from '../models/select_option';

  interface Props {
    input?: boolean
    label?: string
    placeholder?: string
    errors?: string[]
    options?: SelectOption<T>[]
    request?: (text: string) => Promise<SelectOption<T>[]>
    restart?: () => void
  }

  const model = defineModel<SelectOption>()
  const props = defineProps<Props>()

  const id              = nano_id()
  const input           = ref<HTMLInputElement>()
  const options         = ref<SelectOption[]>(props.options ?? [])
  const query           = ref<string>(model.value?.name ?? '')
  const options_enabled = ref<boolean>(false)

  async function request_options() {
    options.value = props.options ?? await props.request?.(query.value) ?? []
  }

  function select(option: SelectOption) {
    query.value = option.name

    options_enabled.value = false
    model.value = option
  }

  function on_input_focus() {
    if (!props.input) input.value?.blur()
  }

  function on_input_query(event: any) {
    Promise.debounce(async () => {
      query.value = event.target.value

      await request_options()

      const option = options.value.find(e => e.name === query.value)

      if (option) {
        options_enabled.value = false
        model.value = option

        query.value = option.name
      }
    }, 1000, id)
  }

  async function on_input_click() {
    options_enabled.value = true

    if (options.value.isEmpty()) {
      await request_options()
    }
  }
</script>

<template>
  <div class="v-selector" v-click-outside="() => options_enabled = false">
    <label v-if="label" :for="id">{{ label }}</label>

    <div class="body">
      <input ref="input" :id="id" :value="query" :placeholder="props.placeholder" @input="on_input_query" @click="on_input_click" @focus="on_input_focus">
      <button v-if="props.restart" class="restart" type="button">
        <v-icon-close v-if="query.isNotEmpty()" @click="props.restart?.()" />
      </button>
    </div>

    <v-errors :errors="props.errors" />

    <div class="options-container">
      <ul v-if="options_enabled">
        <li v-for="(option, i) in options" :key="`option${i}${id}`" @click="select(option)">
          {{ option.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.v-selector {
  position: relative;
  display: grid;
  gap: 2px;
  > label {
    text-indent: 4px;
  }
  > .options-container {
    position: absolute;
    top: 100%;
    width: 100%;
    overflow-y: scroll;
    max-height: 128px;
    z-index: 2;
    background-color: white;
    box-shadow: 0 1px 3px 0 #aaa;
    border-radius: 6px;
    ul {
      li {
        padding: 4px 12px;
        cursor: pointer;
        &:hover {
          background-color: rgba($color_primary, 0.12);
        }
      }
    }
  }
  > .body {
    position: relative;
    > button {
      &.restart {
        display: grid;
        place-items: center;
        position: absolute;
        top: 50%;
        right: 6px;
        transform: translate(0, -50%);
        svg {
          width: 19px;
          height: 19px;
        }
        &:hover {
          svg {
            fill: red;
          }
        }
      }
    }
  }
}
</style>