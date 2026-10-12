import { supabase, isSupabaseConfigured } from '../lib/supabase'

const LOCAL_CRYPTO_KEY = 'fellas_honey_crypto_settings'

export const DEFAULT_CRYPTO_SETTINGS = [
  {
    id: 'usdt-trc20',
    name: 'USDT (TRC-20)',
    symbol: 'USDT',
    network: 'TRON (TRC-20)',
    address: 'TXq9Y7gN3fE4K1vW8sL2rZ5mP0oJ9bA6cD',
    qr_image: '',
    note: 'Lowest transfer fee (~$1 TRON fee)',
    iconColor: 'bg-emerald-600 text-white',
    is_active: true
  },
  {
    id: 'btc',
    name: 'Bitcoin (BTC)',
    symbol: 'BTC',
    network: 'Bitcoin Native SegWit',
    address: 'bc1q9v8y76543210qwertyuiopasdfghjklzxcvbnm',
    qr_image: '',
    note: 'Standard blockchain confirmations',
    iconColor: 'bg-amber-600 text-white',
    is_active: true
  },
  {
    id: 'eth',
    name: 'Ethereum (ETH / ERC-20)',
    symbol: 'ETH',
    network: 'Ethereum Mainnet',
    address: '0x71C3549646c07a346Dab2bE14b486E7eF080F1E2',
    qr_image: '',
    note: 'Supports ETH and ERC-20 tokens',
    iconColor: 'bg-indigo-600 text-white',
    is_active: true
  },
  {
    id: 'sol',
    name: 'Solana (SOL / USDC)',
    symbol: 'SOL',
    network: 'Solana Network',
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    qr_image: '',
    note: 'Instant confirmation (<$0.01 fee)',
    iconColor: 'bg-purple-600 text-white',
    is_active: true
  },
  {
    id: 'bnb',
    name: 'BNB / USDT (BEP-20)',
    symbol: 'BNB',
    network: 'BNB Smart Chain (BEP-20)',
    address: '0x71C3549646c07a346Dab2bE14b486E7eF080F1E2',
    qr_image: '',
    note: 'Supports BNB and BEP-20 tokens',
    iconColor: 'bg-yellow-500 text-amberBrown-950',
    is_active: true
  }
]

export const cryptoService = {
  getCryptoSettings() {
    try {
      const stored = localStorage.getItem(LOCAL_CRYPTO_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (err) {
      console.warn('Failed to parse crypto settings from storage:', err)
    }
    return DEFAULT_CRYPTO_SETTINGS
  },

  saveCryptoSettings(settings) {
    try {
      localStorage.setItem(LOCAL_CRYPTO_KEY, JSON.stringify(settings))
      window.dispatchEvent(new Event('crypto-settings-updated'))
      return settings
    } catch (err) {
      console.error('Failed to save crypto settings:', err)
      throw err
    }
  },

  resetToDefault() {
    try {
      localStorage.setItem(LOCAL_CRYPTO_KEY, JSON.stringify(DEFAULT_CRYPTO_SETTINGS))
      window.dispatchEvent(new Event('crypto-settings-updated'))
      return DEFAULT_CRYPTO_SETTINGS
    } catch (err) {
      console.error('Failed to reset crypto settings:', err)
      throw err
    }
  }
}
