<script setup lang="ts">
  interface IProps {
    is?: string
  }

  const enabled = ref<boolean>(false)
  const timeout = ref<any>(0)
  const props   = defineProps<IProps>()

  function on_mouse_enter() {
    clearTimeout(timeout.value)

    timeout.value = setTimeout(() => {
      enabled.value = true
    }, 300)
  }

  function on_mouse_leave() {
    clearTimeout(timeout.value)

    timeout.value = setTimeout(() => {
      enabled.value = false
    }, 200)
  }

  function on_click_outside() {
    clearTimeout(timeout.value)

    enabled.value = false
  }
</script>

<template>
  <component :is="props.is ?? 'div'" class="v-message" :class="{ enabled }" @mouseenter="on_mouse_enter()" @mouseleave="on_mouse_leave()" v-click-outside="on_click_outside">
    <span v-if="enabled" class="message">
      <slot name="message" />
    </span>
    <slot name="element" />
  </component>
</template>

<style lang="scss">
@keyframes message {
  0%   { opacity: 0; bottom: 90%; }
  50%  { opacity: 1; }
  100% { opacity: 1; bottom: calc(100% + 9px); }
}

.v-message {
  position: relative;
  > .message {
    display: block;
    position: absolute;
    width: max-content;
    max-width: 360px;
    padding: 12px 18px;
    border-radius: 4px;
    background:  white;
    box-shadow: 0 1px 3px 0 #aaa;
    z-index: 9;
    animation: 0.12s ease-out forwards message;
    font-weight: 400;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
  > .message, > .message * {
    white-space: wrap;
    color:  black;
    font-size: 13px;
    line-height: 1.2;
  }
  > button {
    border: 1px solid #ccc;
    border-radius: 100%;
    padding: 4px;
    opacity: 0.4;
    > svg {
      width: 15px;
      height: 15px;
    }
  }
  &:hover, &.enabled {
    > button {
      opacity: 1;
      border: 1px solid rgba($color_primary, 0.12);
      > svg {
        fill: $color_primary;
      }
    }
  }
}
</style>
