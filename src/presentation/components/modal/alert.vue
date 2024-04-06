<script setup lang="ts">
  interface Props {
    title: string
    description: string
  }

  interface Emits {
    (e: 'closed'): void
  }

  const { title, description } = defineProps<Props>()
  const emit = defineEmits<Emits>()
</script>

<template>
  <v-modal class="alert" @closed="emit('closed')">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="footer" v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </v-modal>
</template>

<style lang="scss">
.modal.alert {
  > .container {
    display: grid;
    gap: 12px;
    padding: 24px;
    text-align: center;
    h3 {
      font-size: 17px;
    }
    > .footer {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
    }
  }
}
</style>
