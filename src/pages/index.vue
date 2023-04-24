<script setup lang="ts">
import { QrcodeSuccessCallback } from 'html5-qrcode'

const isAddLinkModalOpen = ref(false)

const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
  console.debug({ decodedText, decodedResult })
}
</script>

<template>
  <div class="flex-1 relative z-0 flex overflow-hidden">
    <main
      class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last"
    >
      <!-- Start main area-->
      <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
        <div class="h-full border-2 border-gray-200 border-dashed rounded-lg">
          <QRScanModal
            @scan-success="onScanSuccess"
          />
        </div>
      </div>
      <!-- End main area -->
    </main>
    <aside
      class="relative xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto"
    >
      <!-- Start secondary column (hidden on smaller screens) -->
      <div
        class="absolute flex h-full flex-col inset-0 pb-6 pt-2 px-4 h-full"
        sm="px-6"
        lg="px-8"
      >
        <div class="flex flex-row justify-between items-center">
          <h2 class="text-2xl py-2">Links</h2>
          <button
            type="button"
            class="h-8 inline-flex flex-0 items-center px-4 py-0 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600"
            hover="bg-indigo-700"
            focus="outline-none ring-2 ring-offset-2 ring-indigo-500"
            @click="isAddLinkModalOpen = true"
          >
            <!-- Heroicon name: solid/plus -->
            <div i-heroicons:plus-20-solid class="-ml-1 mr-2 h-5 w-5" />
            <span>Add</span>
          </button>
        </div>
        <div class="flex-1 border-2 border-gray-200 border-dashed rounded-lg">
          <QuickLinks />
        </div>
      </div>
      <!-- End secondary column -->
    </aside>
    <AddLinkModal $is-open="isAddLinkModalOpen" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
