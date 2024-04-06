<template>
  <span class="loader"></span>
</template>

<style>
.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  margin: 12px auto;
  position: relative;
  background: #eee;
  box-shadow: -18px 0 #eee, 18px 0 #eee;
  box-sizing: border-box;
  animation: shadowPulse 1s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: #eee;
    box-shadow: -18px 0 var(--primary-color), 18px 0 #eee;
  }
  66% {
    background: var(--primary-color);
    box-shadow: -18px 0 #eee, 18px 0 #eee;
  }
  100% {
    background: #eee;
    box-shadow: -18px 0 #eee, 18px 0 var(--primary-color);
  }
}
</style>