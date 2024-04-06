<script setup lang="ts">
import { OrderDirectionEnum, type IBaseFilterOrder } from '~/elpandev/hexagonal/base/domain/filter';

  interface IProps {
    name :       string
    path :       string
    modelValue?: IBaseFilterOrder
  }

  interface IEmits {
    (e: 'update:modelValue', value: IBaseFilterOrder): void
  }

  const props = defineProps<IProps>()
  const emit  = defineEmits<IEmits>()
  const order = ref<IBaseFilterOrder>(props.modelValue?.path == props.path ? { ...props.modelValue } : { path: props.path, direction: OrderDirectionEnum.ASC })

  function change(direction: OrderDirectionEnum) {
    order.value.direction = direction
    order.value.path      = props.path

    emit('update:modelValue', order.value)
  }

  const enabled = computed(() => props.modelValue?.path == props.path)
</script>

<template>
  <th class="v-th-orderable" :class="{ enabled }">
    <span>
      {{ props.name }}
      <div class="arrows">
        <v-icon-expand-less @click="change(OrderDirectionEnum.ASC)"  :class="{ enabled: order.direction == OrderDirectionEnum.ASC }" />
        <v-icon-expand-more @click="change(OrderDirectionEnum.DESC)" :class="{ enabled: order.direction == OrderDirectionEnum.DESC }"  />
      </div>
    </span>
  </th>
</template>

<style lang="scss">
  .v-th-orderable {
    position: relative;
    transition: 0.12s;
    span {
      position: relative;
      .arrows {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -4px;
        svg {
          position: absolute;
          width: 19px;
          height: 19px;
          fill: #ccc;
          cursor: pointer;
          &:nth-of-type(1) {
            bottom: -6px;
          }
          &:nth-of-type(2) {
            top: -5px;
          }
          &:hover {
            fill: $color_primary;
          }
        }
      }
    }
    &.enabled {
      .arrows {
        svg {
          &.enabled {
            fill: $color_primary;
          }
        }
      }
    }
  }
</style>