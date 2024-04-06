<script setup lang="ts">
  const emit = defineEmits<{ (e: 'closed'): void }>()
</script>

<template>
  <div class="modal">
    <div class="curtain" @click="emit('closed')"></div>
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  .curtain {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: rgba($color: #000000, $alpha: 0.4);
    width: 100vw;
    height: 100vh;
  }
  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2;
    width: 90vw;
    max-width: fit-content;
    max-height: 90vh;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 4px;
  }
}
</style>