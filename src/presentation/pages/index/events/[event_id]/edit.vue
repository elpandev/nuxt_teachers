<template>
  <create :event_id="event_id" />
</template>

<script setup lang="ts">
import Create from "../create.vue";

const route    = useRoute()
const event_id = route.params.event_id as string
</script>
