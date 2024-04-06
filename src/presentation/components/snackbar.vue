<script setup lang="ts">
  import { type ISnackbar, useSnackbar } from '../states/snackbar';

  interface Props {
    snackbar: ISnackbar
  }

  const props    = defineProps<Props>()
  const snackbar = useSnackbar()
</script>

<template>
  <div class="snackbar box rounded" :class="{ [props.snackbar.type.url()]: true }">
    <span>{{ props.snackbar.message }}</span>
    <button @click="snackbar.destroy(props.snackbar.id)">
      <v-icon-close />
    </button>
  </div>
</template>

<style lang="scss">
  .snackbar {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 12px 12px 12px 18px;
    box-shadow: 0 1px 3px 0 #ccc;
    &.error {
      background-color: white;
    }
    &.warning {
      background-color: white;
    }
    &.success {
      background-color: white;
    }
  }
</style>
