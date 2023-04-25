import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'

export const useQrScanner = (elementId: string) => {
  let qrCodeScanner: Html5Qrcode | null = null

  const scannerState = ref<Html5QrcodeScannerState>(
    Html5QrcodeScannerState.UNKNOWN
  )

  const isScannerActive = computedEager(
    () =>
      scannerState.value === Html5QrcodeScannerState.SCANNING ||
      scannerState.value === Html5QrcodeScannerState.PAUSED
  )

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

  const stopScanning = async () => {
    await qrCodeScanner?.stop()

    updateScannerState()
  }

  const clearScanner = () => {
    qrCodeScanner?.clear()

    updateScannerState()
  }

  return {
    qrCodeScanner,
    scannerState,
    isScannerActive,
    updateScannerState,
    startScanning,
    pauseScanning,
    stopScanning,
    clearScanner,
  }
}
