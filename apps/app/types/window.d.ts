export {}

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
    gtag: (...params: any) => void // TODO: Add correct typo
  }
}
