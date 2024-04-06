<script setup lang="ts">
  import Create from "../create.vue";

  const route   = useRoute()
  const course_id = route.params.course_id as string
</script>

<template>
  <create :course_id="course_id" />
</template>
