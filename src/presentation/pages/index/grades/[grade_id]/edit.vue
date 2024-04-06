<script setup lang="ts">
  import Create from "../create.vue";

  const route         = useRoute()
  const grade_id = route.params.grade_id as string
</script>

<template>
  <create :grade_id="grade_id" />
</template>
