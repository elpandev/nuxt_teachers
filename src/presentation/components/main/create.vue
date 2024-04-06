
<script setup lang="ts">
  type Props = { name: string }

  defineProps<Props>()
</script>

<template>
  <main class="create">
    <header>
      <h1>{{ name }}</h1>
    </header>
    <slot />
  </main>
</template>

<style lang="scss">
main.create {
  display: grid;
  gap: 12px;
  padding: 18px;
  > header {
    display: flex;
    gap: 6px;
    align-items: flex-end;
    padding: 0 21px;
    h1 {
      margin-right: auto;
      font-size: 21px;
      line-height: 1.2;
    }
  }
  > .form {
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px 0 #eee;
    padding: 24px;
  }
}
</style>