<script setup lang="ts">
import { useUserData } from '@nhost/vue'

const userData = useUserData()
const isModalOpen = ref(true)
</script>

<template>
  <AddLinkModal v-model:is-open="isModalOpen" />
  <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
  <!-- Replace with your content -->
  <div class="py-4">
    <div class="border-4 border-dashed border-gray-200 rounded-lg h-100">
      <p>hola</p>
      <template v-if="userData">
        {{ userData.displayName }} | {{ userData.metadata.firstName }} |
        {{ userData.metadata.lastName }} | {{ userData.email }}
      </template>
    </div>
    <button @click="isModalOpen = true">add link</button>
  </div>
  <!-- /End replace -->
  <!-- </div> -->
</template>

<route lang="yaml">
meta:
  layout: home
</route>
