<script setup lang="ts">
import { useAuthState } from '~/src/presentation/states/auth';
import { useShared } from '~/src/presentation/states/shared';

interface IProps {
  name: string
}

const props  = defineProps<IProps>()
const shared = useShared()
const auth   = useAuthState()
</script>

<template>
  <header class="primary">
    <div class="container">
      <button @click="shared.nav.enabled = !shared.nav.enabled">
        <v-icon-menu />
      </button>
      <span class="title">{{ props.name }}</span>
      <div>
        <slot name="buttons" />
      </div>
    </div>
  </header>
</template>

<style lang="scss">
header.primary {
  top: 0;
  position: sticky;
  z-index: 1;
  background-color: white;
  border-bottom: 1px solid #eee;
  .container {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 12px;
    margin: auto;
    > span {
      font-size: 19px;
      padding-bottom: 3px;
      line-height: 1;
    }
    > div {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-left: auto;
    }
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
  .header {
    > header {
      grid-template-columns: auto auto 1fr auto;
      > form {
        display: grid;
      }
    }
  }
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
