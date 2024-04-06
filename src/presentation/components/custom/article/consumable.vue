<script setup lang="ts">
  import { Consumable } from '~/src/modules/consumable/domain/model';

  type IProps = {
    consumable: Consumable
  }

  const props = defineProps<IProps>()
</script>

<template>
  <article class="consumable">
    <header>
      <h3>{{ props.consumable.name }}</h3>
    </header>
    <div class="content">
      <ul>
        <li>{{ props.consumable.amount.toFinancial() }}</li>
        <li>{{ props.consumable.price.toFinancial() }}</li>
      </ul>
    </div>
  </article>
</template>

<style lang="scss">
article.consumable {
  border: 1px solid #ddd;
  border-radius: 12px;
  &.selected {
    border: 1px solid $color_green;
  }
}
</style>
