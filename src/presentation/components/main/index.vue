
<script setup lang="ts">

</script>

<template>
  <main class="index">
    <header>
      <slot name="header" />
    </header>
    <div class="elements">
      <slot name="elements" />
    </div>
  </main>
</template>

<style lang="scss">
main.index {
  display: grid;
  gap: 24px;
  padding: 24px;
  > header {
    display: flex;
    gap: 6px;
    align-items: flex-end;
    .searcher {
      margin-right: auto;
    }
  }
  > .elements {
    display: grid;
    gap: 15px;
  }
}
</style>