import { ref, h, render } from 'vue'
import Toast from '../components/Toast.vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<HTMLElement[]>([])

export function useToast() {
  function show(options: ToastOptions) {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vnode = h(Toast, {
      ...options,
      onVnodeMounted: () => {
        toasts.value.push(container)
      }
    })

    render(vnode, container)

    setTimeout(() => {
      render(null, container)
      document.body.removeChild(container)
      toasts.value = toasts.value.filter(t => t !== container)
    }, options.duration || 3000)
  }

  function success(message: string, duration = 3000) {
    show({ message, type: 'success', duration })
  }

  function error(message: string, duration = 3000) {
    show({ message, type: 'error', duration })
  }

  function warning(message: string, duration = 3000) {
    show({ message, type: 'warning', duration })
  }

  function info(message: string, duration = 3000) {
    show({ message, type: 'info', duration })
  }

  return {
    show,
    success,
    error,
    warning,
    info
  }
}
