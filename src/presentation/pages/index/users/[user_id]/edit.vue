<script setup lang="ts">
  import Create from "../create.vue";

  const route   = useRoute()
  const user_id = route.params.user_id as string
</script>

<template>
  <create :user_id="user_id" />
</template>
