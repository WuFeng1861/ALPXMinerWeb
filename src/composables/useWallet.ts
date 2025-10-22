import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import { eventBus, EventTypes } from '../utils/eventBus'
import { useToast } from './useToast'

const address = ref<string>('')
const isConnected = ref(false)
const showBindModal = ref(false)

export function useWallet() {
  const shortAddress = computed(() => {
    if (!address.value) return ''
    return `${address.value.slice(0, 5)}...${address.value.slice(-5)}`
  })

  function getProvider(): ethers.BrowserProvider | null {
    if (typeof window.ethereum === 'undefined') {
      return null
    }
    return new ethers.BrowserProvider(window.ethereum)
  }

  async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
    const provider = getProvider()
    if (!provider) {
      return null
    }
    try {
      return await provider.getSigner()
    } catch (error) {
      console.error('Failed to get signer:', error)
      return null
    }
  }

  async function switchToBSC() {
    if (typeof window.ethereum === 'undefined') {
      return false
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      })
      return true
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'BNB Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed1.binance.org'],
                blockExplorerUrls: ['https://bscscan.com'],
              },
            ],
          })
          return true
        } catch (addError) {
          console.error('Failed to add BSC network:', addError)
          return false
        }
      }
      console.error('Failed to switch to BSC:', switchError)
      return false
    }
  }

  async function connectWallet() {
    const toast = useToast()

    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install MetaMask!')
      return
    }

    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum)
      await ethProvider.send('eth_requestAccounts', [])

      const network = await ethProvider.getNetwork()
      if (network.chainId !== 56n) {
        const switched = await switchToBSC()
        if (!switched) {
          toast.warning('Please switch to BNB Smart Chain network')
          return
        }
      }

      const ethSigner = await ethProvider.getSigner()
      const ethAddress = await ethSigner.getAddress()

      address.value = ethAddress
      isConnected.value = true

      console.log('[Wallet] Emitting WALLET_CONNECTED event for', ethAddress)
      eventBus.emit(EventTypes.WALLET_CONNECTED, {
        address: ethAddress,
        provider: ethProvider,
        signer: ethSigner,
      })

      checkReferrer()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  function disconnectWallet() {
    const oldAddress = address.value

    address.value = ''
    isConnected.value = false

    eventBus.emit(EventTypes.WALLET_DISCONNECTED, { address: oldAddress })
  }

  function checkReferrer() {
    const hasReferrer = localStorage.getItem(`referrer_${address.value}`)
    if (!hasReferrer) {
      showBindModal.value = true
    }
  }

  function bindReferrer(referrerAddress: string) {
    localStorage.setItem(`referrer_${address.value}`, referrerAddress)
    showBindModal.value = false
  }

  function closeBindModal() {
    showBindModal.value = false
  }

  return {
    getProvider,
    getSigner,
    address,
    shortAddress,
    isConnected,
    showBindModal,
    connectWallet,
    disconnectWallet,
    bindReferrer,
    closeBindModal,
  }
}
