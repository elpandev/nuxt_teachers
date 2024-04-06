<script setup lang="ts">
  import { EventAuthLogout, observer } from '~/src/shared/domain/observer';

  function on_logout(event: EventAuthLogout) {
    navigateTo('/auth/login')
  }

  onMounted(() => {
    observer.listen(EventAuthLogout, on_logout)
  })

  onUnmounted(() => {
    observer.remove(EventAuthLogout, on_logout)
  })

  definePageMeta({
    middleware: ['auth', 'user', 'subscription'],
  });
</script>

<template>
  <v-custom-nav-primary />

  <NuxtPage />
</template>

<style lang="scss">
#__nuxt {
  display: grid;
  grid-template-columns: auto 1fr;
  align-content: start;
  > nav.primary {
    grid-column: 1;
    grid-row: 1/5;
  }
  > header.primary {
    grid-column: 2;
  }
  > main {
    grid-column: 2;
    padding: 24px;
    margin-bottom: 128px;
  }
}

@media screen and (min-width: 360px) {

}

@media screen and (min-width: 420px) {

}

@media screen and (min-width: 480px) {

}

@media screen and (min-width: 540px) {

}

@media screen and (min-width: 640px) {

}

@media screen and (min-width: 768px) {
  
}

@media screen and (min-width: 854px) {

}

@media screen and (min-width: 960px) {

}

@media screen and (min-width: 1024px) {

}

@media screen and (min-width: 1156px) {

}

@media screen and (min-width: 1280px) {

}
</style>