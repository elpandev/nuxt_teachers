<template>
  <main>
    <header>
      <h1>{{ auth.user.name }}</h1>
    </header>
    <div>
      <span>{{ auth.subscription.type }}</span>
    </div>
  </main>
</template>

<script setup lang="ts">
import { auth } from '~/src/presentation/states/auth';
</script>
