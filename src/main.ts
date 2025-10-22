import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useBalanceStore } from './stores/balance'
import { useMinerStore } from './stores/miner'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化 stores 的事件监听
const balanceStore = useBalanceStore()
balanceStore.initEventListeners()

const minerStore = useMinerStore()
minerStore.initEventListeners()

app.mount('#app')
