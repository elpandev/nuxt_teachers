<script setup lang="ts">
  import Create from "../create.vue";

  const route         = useRoute()
  const attendance_id = route.params.attendance_id as string
</script>

<template>
  <create :attendance_id="attendance_id" />
</template>
