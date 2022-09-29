export type ToastType = 'primary' | 'wran' | 'error' | 'success'

export interface Toast {
  text: string,
  type: ToastType,
  duration: number,
}
