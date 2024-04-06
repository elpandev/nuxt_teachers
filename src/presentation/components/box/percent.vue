<script setup lang="ts">
  interface IProps {
    name: string
    amount: number
    total: number
    color?: string
  }

  const props   = defineProps<IProps>()
  const percent = (props.amount / props.total) * 100
</script>

<template>
  <div class="v-box-percent">
    <span class="label">{{ props.amount }}/{{ props.total }}</span>
    <div class="percent">
      <v-canvas-percent :percent="percent" :size="100" :stroke_width="10" :color="color" />
      <span class="value">{{ percent.toFixed(0) }}%</span>
    </div>
    <span class="name">{{ props.name }}</span>
  </div>
</template>

<style lang="scss">
.v-box-percent {
  position: relative;
  display: grid;
  place-items: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px 0 #ddd;
  padding: 12px 18px;
  > .label {
    font-size: 13px;
    color: #aaa;
    letter-spacing: 3px;
    margin-bottom: 9px;
  }
  > .percent {
    display: grid;
    place-items: center;
    position: relative;
    > .value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 15px;
    }
  }
  > .name {
    text-align: center;
    margin-top: 18px;
    padding: 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
}
</style>
