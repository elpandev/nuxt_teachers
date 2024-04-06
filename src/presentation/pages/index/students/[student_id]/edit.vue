<script setup lang="ts">
  import Create from "../create.vue";

  const route   = useRoute()
  const student_id = route.params.student_id as string
</script>

<template>
  <create :student_id="student_id" />
</template>
