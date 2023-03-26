<script setup lang="ts">
const isSignIn = ref(true)
</script>

<template>
  <SignUpSignIn v-model:is-sign-in="isSignIn" />
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
