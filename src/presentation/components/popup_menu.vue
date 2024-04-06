<script setup lang="ts">
  const enabled = ref<boolean>(false)
</script>

<template>
  <div class="popup-menu" :class="{ enabled }" v-click-outside="() => enabled = false">
    <button @click="enabled = !enabled">
      <slot name="icon">
        <v-icon-menu />
      </slot>
    </button>
    <div class="content" v-if="enabled">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@keyframes popup-menu {
  from {
    right: calc(100%);
    opacity: 0;
  }
}

.popup-menu {
  position: relative;
  display: grid;
  place-items: center;
  > .content {
    position: absolute;
    top: 50%;
    right: calc(100% + 15px);
    transform: translateY(-50%);
    background-color: white;
    border: 1px solid #eee;
    border-radius: 9px;
    box-shadow: 0 1px 0 0 #aaa;
    animation-name: popup-menu;
    animation-duration: 0.24s;
    width: max-content;
    // padding: 12px;
    z-index: 1;
    > button, > a {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 6px 12px 6px 6px;
      font-size: 13px;
      color: black;
      width: 100%;
      &:hover {
        background-color: rgba($color_primary, 0.12);
        color: $color_primary;
        svg {
          fill: $color_primary;
        }
      }
      svg {
        &.assignment {
          padding: 1px;
        }
        &.close {
          padding: 1px;
        }
        &.edit {
          padding: 3px;
        }
        &.visibility {
          padding: 2px;
        }
      }
    }
  }
  &.enabled {
    > button {
      svg {
        fill: $color_primary;
      }
    }
  }
}
</style>