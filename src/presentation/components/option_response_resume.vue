<script setup lang="ts">
import { QuestionOption } from '~/src/modules/question/domain/values/option';
import type { QuestionResponse } from '~/src/modules/question/domain/values/response';

  type IProps = {
    option:           QuestionOption
    responses_length: number
    responses:        QuestionResponse[]
  }

  const props   = defineProps<IProps>()
  const percent = props.responses.length.toPercent(props.responses_length)
</script>

<template>
  <div class="option-response-resume" :class="{ selected: option.selected }">
    <v-icon-done  v-if="option.selected"/>
    <v-icon-close v-else />
    <span>{{ option.option }}</span>
    <span>{{ props.responses.length }} ({{ percent.toFixed(0) }}%)</span>
    <span class="percent" v-if="percent > 0" :style="{ width: `${percent}%` }"></span>
  </div>
</template>

<style lang="scss">
.option-response-resume {
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
