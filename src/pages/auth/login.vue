<script setup lang="ts">
const isSignIn = ref(true)
</script>

<template>
  <SignUp v-model:is-sign-in="isSignIn" />
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
