import React, { useState, useEffect } from 'react'
import {
  Coins,
  QrCode,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Eye
} from 'lucide-react'
import { cryptoService, DEFAULT_CRYPTO_SETTINGS } from '../../services/cryptoService'
import { useToast } from '../../context/ToastContext'

export const AdminCryptoSettings = () => {
  const [cryptoList, setCryptoList] = useState([])
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [newCoinModal, setNewCoinModal] = useState(false)
  const [newCoin, setNewCoin] = useState({
    name: '',
    symbol: '',
    network: '',
    address: '',
    note: '',
    iconColor: 'bg-honey-600 text-white'
  })

  const { addToast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const settings = cryptoService.getCryptoSettings()
    setCryptoList(settings)
  }

  const handleFieldChange = (id, field, value) => {
    setCryptoList(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleToggleActive = (id) => {
    setCryptoList(prev =>
      prev.map(item => (item.id === id ? { ...item, is_active: !item.is_active } : item))
    )
  }

  const handleQrUpload = (id, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file (PNG, JPG, WEBP)', 'error')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast('QR image size should be under 2MB', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      handleFieldChange(id, 'qr_image', reader.result)
      addToast('Custom QR code uploaded! 📸', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveCustomQr = (id) => {
    handleFieldChange(id, 'qr_image', '')
    addToast('Reverted to auto-generated QR code', 'info')
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    addToast('Address copied to clipboard!', 'success')
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleSaveAll = (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      cryptoService.saveCryptoSettings(cryptoList)
      addToast('✅ Cryptocurrency payment addresses & QR codes updated successfully!', 'success')
    } catch (err) {
      addToast('Failed to save crypto settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all crypto addresses to default demo values?')) {
      const reset = cryptoService.resetToDefault()
      setCryptoList(reset)
      addToast('Reset to default crypto configuration', 'info')
    }
  }

  const handleAddCustomCoin = (e) => {
    e.preventDefault()
    if (!newCoin.name || !newCoin.symbol || !newCoin.address || !newCoin.network) {
      addToast('Please fill in all required fields for the new coin', 'error')
      return
    }

    const customId = `coin-${Date.now()}`
    const coinToAdd = {
      id: customId,
      name: newCoin.name,
      symbol: newCoin.symbol.toUpperCase(),
      network: newCoin.network,
      address: newCoin.address.trim(),
      qr_image: '',
      note: newCoin.note || 'Transfer to the above address',
      iconColor: newCoin.iconColor || 'bg-amber-600 text-white',
      is_active: true
    }

    const updated = [...cryptoList, coinToAdd]
    setCryptoList(updated)
    cryptoService.saveCryptoSettings(updated)
    setNewCoinModal(false)
    setNewCoin({ name: '', symbol: '', network: '', address: '', note: '', iconColor: 'bg-honey-600 text-white' })
    addToast(`Added ${coinToAdd.name} to supported cryptocurrencies! 🪙`, 'success')
  }

  const handleDeleteCoin = (id, name) => {
    if (window.confirm(`Delete ${name} from payment options?`)) {
      const updated = cryptoList.filter(c => c.id !== id)
      setCryptoList(updated)
      cryptoService.saveCryptoSettings(updated)
      addToast(`Removed ${name}`, 'info')
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 flex items-center gap-1 uppercase tracking-wider">
              <Coins className="w-3 h-3 text-amber-700" />
              Web3 Payment Gateway
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-amberBrown-950">
            Cryptocurrency & QR Management
          </h1>
          <p className="text-xs sm:text-sm text-amberBrown-600">
            Configure deposit wallet addresses, custom QR codes, and networks displayed to customers during checkout.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-cream-50 hover:bg-honey-100 border border-honey-300 text-amberBrown-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setNewCoinModal(true)}
            className="px-4 py-2.5 bg-amberBrown-900 hover:bg-amberBrown-950 text-honey-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Coin</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        
        <div className="grid grid-cols-1 gap-6">
          {cryptoList.map((coin, index) => {
            const qrSrc =
              coin.qr_image ||
              `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=2&data=${encodeURIComponent(
                coin.address || 'EMPTY'
              )}`

            return (
              <div
                key={coin.id}
                className={`bg-white rounded-3xl p-5 sm:p-7 border shadow-soft transition-all space-y-5 ${
                  coin.is_active
                    ? 'border-honey-300'
                    : 'border-honey-100 opacity-60 bg-cream-50/50'
                }`}
              >
                {/* Coin Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-honey-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-2xl text-xs font-black flex items-center justify-center shadow-xs ${coin.iconColor}`}>
                      {coin.symbol.slice(0, 3)}
                    </span>
                    <div>
                      <h3 className="font-serif font-black text-lg text-amberBrown-950 flex items-center gap-2">
                        {coin.name}
                        {!coin.is_active && (
                          <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            Disabled
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-amberBrown-500 font-medium">
                        Network: <strong>{coin.network}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Active Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(coin.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        coin.is_active
                          ? 'bg-natureGreen-100 text-natureGreen-800 border border-natureGreen-300'
                          : 'bg-cream-100 text-amberBrown-600 border border-honey-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{coin.is_active ? 'Active at Checkout' : 'Enable Coin'}</span>
                    </button>

                    {/* Delete Custom Coin */}
                    {index >= DEFAULT_CRYPTO_SETTINGS.length && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCoin(coin.id, coin.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete coin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Coin Body: Fields & QR */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Input Fields */}
                  <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm">
                    
                    {/* Deposit Address */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-amberBrown-900 block flex items-center justify-between">
                        <span>Wallet / Deposit Address *</span>
                        <span className="text-[11px] text-amberBrown-500 font-normal">
                          Live auto-updates customer QR
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={coin.address}
                          onChange={(e) => handleFieldChange(coin.id, 'address', e.target.value)}
                          placeholder="e.g. 0x... or Tron Address"
                          className="w-full pl-3.5 pr-20 py-2.5 bg-cream-50 rounded-xl border border-honey-300 font-mono text-xs text-amberBrown-950 focus:outline-none focus:ring-2 focus:ring-honey-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(coin.id, coin.address)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white hover:bg-honey-100 border border-honey-200 rounded-lg text-[11px] font-bold text-amberBrown-800 transition-colors flex items-center gap-1"
                        >
                          {copiedId === coin.id ? (
                            <>
                              <Check className="w-3 h-3 text-natureGreen-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Network Name */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-amberBrown-900 block">
                          Network Name
                        </label>
                        <input
                          type="text"
                          value={coin.network}
                          onChange={(e) => handleFieldChange(coin.id, 'network', e.target.value)}
                          placeholder="e.g. TRON (TRC-20), ERC-20"
                          className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                        />
                      </div>

                      {/* Display Label / Coin Name */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-amberBrown-900 block">
                          Coin Name / Display Label
                        </label>
                        <input
                          type="text"
                          value={coin.name}
                          onChange={(e) => handleFieldChange(coin.id, 'name', e.target.value)}
                          placeholder="e.g. USDT (TRC-20)"
                          className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                        />
                      </div>
                    </div>

                    {/* Customer Instruction / Note */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-amberBrown-900 block">
                        Customer Checkout Note / Guidance
                      </label>
                      <input
                        type="text"
                        value={coin.note}
                        onChange={(e) => handleFieldChange(coin.id, 'note', e.target.value)}
                        placeholder="e.g. Lowest transfer fee (~$1 TRON fee)"
                        className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                      />
                    </div>

                  </div>

                  {/* Right: Live QR Preview & Custom QR Upload */}
                  <div className="lg:col-span-4 bg-cream-50/70 p-4 rounded-2xl border border-honey-200 flex flex-col items-center justify-center text-center space-y-3">
                    <span className="text-[11px] font-bold text-amberBrown-900 uppercase tracking-wider">
                      Live Customer QR Code
                    </span>

                    <div className="p-2.5 bg-white rounded-2xl border border-honey-300 shadow-honey-sm inline-block">
                      <img
                        src={qrSrc}
                        alt={`${coin.name} QR Code`}
                        className="w-32 h-32 object-contain rounded-lg"
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <p className="text-[10px] text-amberBrown-500 font-medium">
                        {coin.qr_image ? 'Custom QR uploaded' : 'Auto-generated from address'}
                      </p>

                      <div className="flex items-center justify-center gap-2 pt-1">
                        <input
                          type="file"
                          id={`qr-upload-${coin.id}`}
                          accept="image/*"
                          onChange={(e) => handleQrUpload(coin.id, e)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`qr-upload-${coin.id}`}
                          className="px-2.5 py-1 bg-white hover:bg-honey-100 border border-honey-300 rounded-lg text-[11px] font-bold text-amberBrown-800 cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>Upload Custom QR</span>
                        </label>

                        {coin.qr_image && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomQr(coin.id)}
                            className="px-2 py-1 text-red-500 hover:bg-red-50 rounded-lg text-[11px] font-bold transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

        {/* Floating / Bottom Save Bar */}
        <div className="sticky bottom-6 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-honey-300 shadow-soft-lg flex items-center justify-between gap-4">
          <div>
            <p className="font-serif font-black text-sm text-amberBrown-950">
              Save Crypto Payment Gateway Configurations
            </p>
            <p className="text-xs text-amberBrown-600">
              Changes take effect immediately on customer checkout and mobile views.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-amber-gold-gradient hover:opacity-95 text-amberBrown-950 font-black text-xs sm:text-sm rounded-2xl shadow-honey-md transition-all active:scale-95 disabled:opacity-75 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Addresses & QR Codes'}</span>
          </button>
        </div>

      </form>

      {/* Add Custom Coin Modal */}
      {newCoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amberBrown-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-honey-300 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-honey-100">
              <h3 className="font-serif font-bold text-lg text-amberBrown-950 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <span>Add Cryptocurrency</span>
              </h3>
              <button
                onClick={() => setNewCoinModal(false)}
                className="p-1 text-amberBrown-400 hover:text-amberBrown-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomCoin} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">Coin Name *</label>
                <input
                  type="text"
                  required
                  value={newCoin.name}
                  onChange={(e) => setNewCoin(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Polygon (MATIC) or Dogecoin"
                  className="w-full px-3.5 py-2 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-amberBrown-900 block">Symbol *</label>
                  <input
                    type="text"
                    required
                    value={newCoin.symbol}
                    onChange={(e) => setNewCoin(prev => ({ ...prev, symbol: e.target.value }))}
                    placeholder="e.g. MATIC"
                    className="w-full px-3.5 py-2 bg-cream-50 rounded-xl border border-honey-300 uppercase text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-amberBrown-900 block">Network *</label>
                  <input
                    type="text"
                    required
                    value={newCoin.network}
                    onChange={(e) => setNewCoin(prev => ({ ...prev, network: e.target.value }))}
                    placeholder="e.g. Polygon PoS"
                    className="w-full px-3.5 py-2 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">Deposit Wallet Address *</label>
                <input
                  type="text"
                  required
                  value={newCoin.address}
                  onChange={(e) => setNewCoin(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3.5 py-2 bg-cream-50 rounded-xl border border-honey-300 font-mono text-xs text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-amberBrown-900 block">Customer Guidance Note</label>
                <input
                  type="text"
                  value={newCoin.note}
                  onChange={(e) => setNewCoin(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="e.g. Fast polygon network confirmation"
                  className="w-full px-3.5 py-2 bg-cream-50 rounded-xl border border-honey-300 text-amberBrown-900 focus:outline-none focus:ring-2 focus:ring-honey-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setNewCoinModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-honey-100 text-amberBrown-800 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-gold-gradient text-amberBrown-950 text-xs font-black rounded-xl shadow-honey-sm"
                >
                  Add to Payment Options
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
