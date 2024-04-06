<script setup lang="ts">
  interface Props {
    errors?: string[]
  }

  const props = defineProps<Props>();
</script>

<template>
  <ul class="errors" v-if="props.errors">
    <li class="error" v-for="error in props.errors" :key="error">
      {{ error }}
    </li>
  </ul>
</template>
