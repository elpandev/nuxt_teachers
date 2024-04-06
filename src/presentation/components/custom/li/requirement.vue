<script setup lang="ts">
  import { Requirement } from '~/src/modules/requirement/domain/model';

  interface IProps {
    requirement: Requirement
  }

  const props = defineProps<IProps>()
</script>

<template>
  <li class="requirement">
    <v-icon-schedule v-if="props.requirement.is_pending" />
    <v-icon-warning  v-if="props.requirement.is_problem" />
    <v-icon-done     v-if="props.requirement.is_completed" />
    <div class="content">
      <span class="name">{{ props.requirement.role?.name }}</span>
      <span class="description">{{ props.requirement.description }}</span>
    </div>
  </li>
</template>

<style lang="scss">
li.requirement {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: center;
  border-radius: 4px;
  padding: 9px;
  background-color: white;
  svg {
    &.schedule {
      fill: teal;
    }
    &.warning {
      fill: orange;
    }
    &.done {
      fill: green;
    }
  }
  .content {
    display: grid;
    align-items: center;
    .name {
      font-weight: bold;
    }
    .description {
      color: grey;
      font-size: 15px;
    }
  }
}
</style>
