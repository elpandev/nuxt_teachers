<script setup lang="ts">
  import Create from "../create.vue";

  const route   = useRoute()
  const task_id = route.params.task_id as string
</script>

<template>
  <create :task_id="task_id" />
</template>
