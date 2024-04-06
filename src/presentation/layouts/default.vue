<script setup lang="ts">
  import { useSnackbar } from '../states/snackbar';

  const snackbar = useSnackbar()
</script>

<template>
  <slot />
  <div class="snackbars">
    <v-snackbar v-for="item in snackbar.snackbars" :key="item.id" :snackbar="item" />
  </div>
</template>

<style lang="scss">
#__nuxt {
  display: grid;
  .snackbars {
    display: grid;
    gap: 12px;
    position: fixed;
    bottom: 12px;
    right: 12px;
    z-index: 9;
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