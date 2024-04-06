<script setup lang="ts">
  interface Emits {
    (e: 'closed'): void
  }

  const emit = defineEmits<Emits>()
</script>

<template>
  <v-modal-alert
    class="register"
    :title="'Debes Registrarte'"
    :description="'Registrate para poder agregar productos a tus sección de favoritos'"
    @closed="emit('closed')"
  >
    <template #footer>
      <button class="button text red" @click="emit('closed')">Más Tarde</button>
      <NuxtLink class="button text teal" to="/auth/register">Registrarse</NuxtLink>
    </template>
  </v-modal-alert>
</template>

<style lang="scss">
.modal.register {
  > .container {
    max-width: 400px;
  }
}
</style>