<template>
  <create :table_id="table_id" />
</template>

<script setup lang="ts">
import Create from "../create.vue";

const route    = useRoute()
const table_id = route.params.table_id as string
</script>
