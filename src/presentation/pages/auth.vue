<script setup lang="ts">
  import { EventAuthRegister, EventAuthLogin, observer } from '~/src/shared/domain/observer';

  const route = useRoute()

  function on_login(event: EventAuthLogin) {
    navigateTo('/')
  }

  function on_register(event: EventAuthRegister) {
    navigateTo('/')
  }

  onMounted(() => {
    observer.listen(EventAuthLogin,    on_login)
    observer.listen(EventAuthRegister, on_register)
  })

  onUnmounted(() => {
    observer.remove(EventAuthLogin,    on_login)
    observer.remove(EventAuthRegister, on_register)
  })
</script>

<template>
  <main class="auth box rounded">
    <nav>
      <nuxt-link class="button outline text teal" :class="{ solid: route.path == '/auth/login' }" to="/auth/login">Ingresar</nuxt-link>
      <nuxt-link class="button outline text teal" :class="{ solid: route.path == '/auth/register' }" to="/auth/register">Registrarse</nuxt-link>
    </nav>
    <NuxtPage />
  </main>
</template>

<style lang="scss">
  main.auth {
    display: grid;
    gap: 24px;
    max-width: 480px;
    width: 90vw;
    margin: 48px auto 128px auto;
    padding: 24px;
    > nav {
      display: grid;
      grid-template-columns: repeat(2, 128px);
      gap: 12px;
      justify-content: center;
    }
  }
</style>
