import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeScannerState,
} from 'html5-qrcode'

export const useQrScanner = (elementId: string) => {
  let qrCodeScanner: Html5Qrcode | null = null

  const getScanner = () => {
    return qrCodeScanner
  }

  const scannerState = ref<Html5QrcodeScannerState>(
    Html5QrcodeScannerState.UNKNOWN
  )

  const isScannerActive = computedEager(
    () =>
      scannerState.value === Html5QrcodeScannerState.SCANNING ||
      scannerState.value === Html5QrcodeScannerState.PAUSED
  )

  const getAvailableCameras = async () => {
    return Html5Qrcode.getCameras()
  }

  const availableCameras = ref<CameraDevice[]>([])
  const selectedCamera = ref<CameraDevice | undefined>()
  const hasAvailableCameras = computed(() => availableCameras.value.length > 0)
  const isTorchEnabled = ref(false)

  const getCameraCapabilities = () => {
    return qrCodeScanner?.getRunningTrackCameraCapabilities()
  }

  const getActiveCamera = () => {
    const currentCameraId =
      qrCodeScanner?.getRunningTrackCapabilities()?.deviceId

    return availableCameras.value.find(
      (camera) => camera.id === currentCameraId
    )
  }

  const isTorchSupported = ref(false)

  const updateIsTorchSupported = () => {
    isTorchSupported.value =
      getCameraCapabilities()?.torchFeature().isSupported() ?? false
  }

  const turnOnTorch = () => {
    getCameraCapabilities()?.torchFeature().apply(true)
    isTorchEnabled.value = true
  }

  const turnOffTorch = () => {
    getCameraCapabilities()?.torchFeature().apply(false)
    isTorchEnabled.value = false
  }

  const toggleTorch = () => {
    isTorchEnabled.value ? turnOffTorch() : turnOnTorch()
  }

  const updateScannerState = () => {
    scannerState.value =
      qrCodeScanner?.getState() ?? Html5QrcodeScannerState.UNKNOWN
  }

  const startScanning = async (
    ...startScanArgs: Parameters<Html5Qrcode['start']>
  ) => {
    qrCodeScanner ??= new Html5Qrcode(elementId, false)

    await qrCodeScanner?.start(...startScanArgs)

    updateScannerState()
  }

  const pauseScanning = () => {
    qrCodeScanner?.pause(true)

    updateScannerState()
  }

  const resumeScanning = () => {
    qrCodeScanner?.resume()

    updateScannerState()
  }

  const stopScanning = async () => {
    isScannerActive.value && (await qrCodeScanner?.stop())

    updateScannerState()
  }

  const clearScanner = () => {
    qrCodeScanner?.clear()

    updateScannerState()
  }

  return {
    getScanner,
    scannerState,
    isScannerActive,
    updateScannerState,
    startScanning,
    pauseScanning,
    resumeScanning,
    stopScanning,
    clearScanner,
    getAvailableCameras,
    isTorchSupported,
    updateIsTorchSupported,
    selectedCamera,
    getActiveCamera,
    hasAvailableCameras,
    availableCameras,
    isTorchEnabled,
    turnOnTorch,
    turnOffTorch,
    toggleTorch,
  }
}
