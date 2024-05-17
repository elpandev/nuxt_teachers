<script setup lang="ts">
import { EventAuthRegister, EventAuthLogin, observer } from '~/src/shared/domain/observer';
import { auth } from '../states/auth';

const route = useRoute()

function on_login(event: EventAuthLogin) {
  auth.store_token_to_local(event.token)

  navigateTo('/')
}

function on_register(event: EventAuthRegister) {
  auth.store_token_to_local(event.token)

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
  <main class="auth">
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
  margin: 20vh auto 0 auto;
  padding: 48px;
  box-shadow: 0 1px 3px 0 #ccc;
  border-radius: 24px;
  > nav {
    display: grid;
    grid-template-columns: repeat(2, 128px);
    gap: 12px;
    justify-content: center;
  }
}
</style>
