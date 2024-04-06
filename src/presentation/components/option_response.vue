<script setup lang="ts">
import { QuestionOption } from '~/src/modules/question/domain/values/option';
import type { QuestionResponse } from '~/src/modules/question/domain/values/response';

  type IProps = {
    option:   QuestionOption
    response?: QuestionResponse
  }

  const props    = defineProps<IProps>()
  const selected = props.response?.option_id == props.option.id
</script>

<template>
  <div class="option-response" :class="{ selected: selected }">
    <template v-if="selected">
      <v-icon-done  v-if="props.option.selected"/>
      <v-icon-close v-else />
    </template>
    <v-icon-done v-else-if="props.option.selected" style="opacity: 0.24;"/>
    <v-icon-close v-else style="opacity: 0.24;" />
    <span>{{ option.option }}</span>
  </div>
</template>

<style lang="scss">
.option-response {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  position: relative;
  background-color: white;
  padding: 9px 12px;
  border-radius: 9px;
  svg {
    &.done {
      fill: green;
    }
    &.close {
      fill: red;
    }
  }
  .percent {
    position: absolute;
    height: 100%;
    border-radius: 9px;
    background-color: rgba($color_red, 0.24);
  }
  &.selected {
    .percent {
      background-color: rgba($color_green, 0.24);
    }
  }
}
</style>
