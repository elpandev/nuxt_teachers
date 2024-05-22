<template>
  <div class="v-task-timer">
    {{ time.toFormat() }}
  </div>
</template>

<script setup lang="ts">
import { Time } from '~/elpandev/utils';

interface IProps {
  end_at: number
}

const { end_at } = defineProps<IProps>()

const time = ref<Time>(new Time())

const interval = ref()

function start() {
  interval.value = setInterval(() => {
    time.value = new Time().fromSeconds((end_at - Date.now())/1000)
  }, 1000)
}

function stop() {
  clearInterval(interval.value)
}

onMounted(start)

onUnmounted(stop)
</script>

<style lang="scss">
.v-task-timer {
  background-color: #f7f7f7;
  border-radius: 9px;
  padding: 9px 15px;
  border: 1px solid #ddd;
}
</style>
