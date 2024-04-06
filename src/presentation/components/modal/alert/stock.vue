<script setup lang="ts">
  interface Emits {
    (e: 'closed'): void
  }

  const emit = defineEmits<Emits>()
</script>

<template>
  <v-modal-alert
    :title="'Producto Agotado'"
    :description="'Este producto se encuentra agotado'"
    @closed="emit('closed')"
  />
</template>
