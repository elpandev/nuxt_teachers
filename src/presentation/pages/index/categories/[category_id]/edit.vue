<script setup lang="ts">
  import Create from "../create.vue";

  const route   = useRoute()
  const category_id = route.params.category_id as string
</script>

<template>
  <create :category_id="category_id" />
</template>
