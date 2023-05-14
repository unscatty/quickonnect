<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import {
  CameraDevice,
  Html5QrcodeCameraScanConfig,
  Html5QrcodeResult,
  QrcodeSuccessCallback,
} from 'html5-qrcode'

const {
  isScannerActive,
  startScanning: startQrScanning,
  stopScanning,
  clearScanner,
  getAvailableCameras,
  isTorchSupported,
  updateIsTorchSupported,
  toggleTorch,
  isTorchEnabled,
  availableCameras,
  selectedCamera,
  getActiveCamera,
  hasAvailableCameras,
} = useQrScanner('qr-code-full-region')

const props = withDefaults(
  defineProps<Html5QrcodeCameraScanConfig & { isOpen?: boolean }>(),
  {
    fps: 5,
    isOpen: false,
  }
)

const emit = defineEmits(['scanSuccess', 'update:isOpen'])

const isOpen = useVModel(props, 'isOpen', emit)

const qrResult = ref<Html5QrcodeResult | undefined>()

const onScanSuccess: QrcodeSuccessCallback = (decodedText, decodedResult) => {
  qrResult.value = decodedResult
  emit('scanSuccess', decodedText, decodedResult)
}

const smOrLess = useBreakpoints(breakpointsTailwind).smallerOrEqual('sm')

const computeQrBox = (
  defaultValue: Html5QrcodeCameraScanConfig['qrbox'] = 300
): Html5QrcodeCameraScanConfig['qrbox'] => {
  return smOrLess.value ? 180 : defaultValue ?? 300
}

const close = async () => {
  isOpen.value = false

  try {
    await stopScanning()
  } catch (error) {
    console.error(error)
  }
}

const startScanning = async () => {
  try {
    if (!hasAvailableCameras.value) {
      availableCameras.value = await getAvailableCameras()
    }

    await startQrScanning(
      selectedCamera.value?.id ?? { facingMode: 'environment' },
      {
        ...props,
        qrbox: computeQrBox(props.qrbox),
      },
      onScanSuccess,
      undefined
    )

    // Get the selected camera if not set already
    selectedCamera.value ??= getActiveCamera()

    updateIsTorchSupported()
  } catch (error) {
    console.error(error)
  }
}

const switchCamera = async (camera: CameraDevice) => {
  if (selectedCamera.value?.id === camera.id) return

  selectedCamera.value = camera

  try {
    await stopScanning()
    await startScanning()

    updateIsTorchSupported()
  } catch (error) {
    console.error(error)
  }
}

// Asks for camera permission as soon as the modal is opened
const stopIsOpenWatcher = whenever(isOpen, startScanning, {
  flush: 'post',
})

onUnmounted(async () => {
  try {
    await stopScanning()
    clearScanner()
    stopIsOpenWatcher()
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      :unmount="false"
      @close="close"
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
              <div class="text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  Scan QR Code
                </DialogTitle>
                <div class="mt-2">
                  <!-- Action buttons -->
                  <div
                    v-if="isScannerActive"
                    class="absolute right-4 sm:right-6"
                  >
                    <span
                      class="relative z-99 inline-flex shadow-sm rounded-md p-1"
                      sm="p-2"
                    >
                      <Menu as="span" class="-ml-px relative block">
                        <MenuButton
                          v-if="hasAvailableCameras"
                          class="relative inline-flex gap-1 items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500"
                          :class="isTorchSupported ? '' : 'rounded-r-md'"
                          hover="bg-gray-50"
                          focus="z-10 outline-none ring-1 ring-indigo-500 border-indigo-500"
                        >
                          <span class="sr-only">Open options</span>
                          <div
                            i-mdi:camera-switch
                            class="mx-auto h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <div
                            i-heroicons:chevron-down
                            class="h-5 w-5"
                            aria-hidden="true"
                          />
                        </MenuButton>
                        <transition
                          enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95"
                        >
                          <MenuItems
                            class="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            <div class="py-1">
                              <MenuItem
                                v-for="camera in availableCameras"
                                :key="camera.id"
                                v-slot="{ active }"
                                as="button"
                                @click="switchCamera(camera)"
                              >
                                <!-- :href="item.href" -->
                                <p
                                  :class="[
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700',
                                    'block px-4 py-2 text-sm',
                                  ]"
                                >
                                  {{ camera.label }}
                                </p>
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </transition>
                      </Menu>
                      <button
                        v-if="isTorchSupported"
                        type="button"
                        class="-ml-px relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        @click="toggleTorch"
                      >
                        <div
                          class="mx-auto h-5 w-5 text-gray-400"
                          :class="
                            isTorchEnabled
                              ? 'i-mdi:flashlight'
                              : 'i-mdi:flashlight-off'
                          "
                          aria-hidden="true"
                        />
                      </button>
                    </span>
                  </div>

                  <!-- QR scanner -->
                  <div id="qr-code-full-region" />
                  <!-- Placeholder for camera permissions -->
                  <div
                    v-if="!isScannerActive"
                    class="text-center border-2 border-gray-300 border-dashed rounded-lg p-4"
                  >
                    <div
                      i-mdi:camera-lock
                      class="mx-auto h-12 w-12 text-gray-900"
                    ></div>
                    <h3 class="mt-2 text-md font-medium text-gray-900">
                      Enable Camera
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Permission is needed to scan QRCode
                    </p>
                    <div class="mt-6">
                      <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        @click="startScanning"
                      >
                        Allow access to camera
                      </button>
                    </div>
                  </div>
                  <p class="text-black">{{ qrResult }}</p>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <button
                type="button"
                class="mt-3 mx-auto w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                @click="close"
              >
                Cancelar
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
