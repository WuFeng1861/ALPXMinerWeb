type EventCallback = (...args: any[]) => void

class EventBus {
  private events: Map<string, EventCallback[]>

  constructor() {
    this.events = new Map()
  }

  // 订阅事件
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    const callbacks = this.events.get(event)!
    callbacks.push(callback)

    // 返回取消订阅函数
    return () => {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // 发布事件
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
  }

  // 取消订阅
  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      // 如果没有提供回调，删除该事件的所有订阅
      this.events.delete(event)
      return
    }

    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // 只订阅一次
  once(event: string, callback: EventCallback): () => void {
    const wrapper = (...args: any[]) => {
      callback(...args)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }

  // 清除所有事件
  clear(): void {
    this.events.clear()
  }
}

// 导出单例
export const eventBus = new EventBus()

// 预定义的事件类型
export const EventTypes = {
  WALLET_CONNECTED: 'wallet:connected',
  WALLET_DISCONNECTED: 'wallet:disconnected',
  WALLET_CHANGED: 'wallet:changed',
  BALANCE_UPDATE: 'balance:update',
  SHOW_BIND_REFERRER_MODAL: 'modal:show-bind-referrer',
} as const

export type EventType = typeof EventTypes[keyof typeof EventTypes]
