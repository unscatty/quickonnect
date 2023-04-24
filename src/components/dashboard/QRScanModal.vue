<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
  Html5QrcodeScannerState,
  QrcodeSuccessCallback,
} from 'html5-qrcode'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    config?: Html5QrcodeCameraScanConfig
  }>(),
  {
    config: (props) => {
      return {
        fps: props.config?.fps ?? 10,
        qrbox: props.config?.qrbox ?? 500,
      }
    },
    isOpen: true,
  }
)

const emit = defineEmits(['scanSuccess', 'update:isOpen'])

const isOpen = useVModel(props, 'isOpen', emit)

const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
  emit('scanSuccess', decodedText, decodedResult)
}

let html5Qrcode: Html5Qrcode | null = null

onMounted(async () => {
  html5Qrcode = new Html5Qrcode('qr-code-full-region', false)

  await html5Qrcode.start(
    { facingMode: 'environment' },
    {
      ...props.config,
    },
    onScanSuccess,
    undefined
  )
})

onUnmounted(() => {
  if (html5Qrcode) {
    try {
      html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING &&
        html5Qrcode.stop()
      html5Qrcode.clear()
    } catch (error) {
      console.error(error)
    }
  }
})
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="isOpen = false"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div>
              <div
                class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
              >
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  Payment successful
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Eius aliquam laudantium explicabo pariatur iste dolorem
                    animi vitae error totam. At sapiente aliquam accusamus
                    facere veritatis.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
            >
              <button
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                @click="isOpen = false"
              >
                Deactivate
              </button>
              <button
                ref="cancelButtonRef"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                @click="isOpen = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
  <div id="qr-code-full-region"></div>
</template>
