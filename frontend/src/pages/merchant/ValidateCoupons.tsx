import React, { useCallback, useState } from 'react'
import MerchantNavbar from '../../components/MerchantNavbar'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from 'axios'

export default function ValidateCoupons() {
  const [result, setResult] = useState<any>(null)

  const onScan = useCallback((token: string) => {
    // send to backend validate endpoint
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    axios.post(`${BACKEND}/coupons/validate`, { token }).then((r) => setResult(r.data)).catch((e) => setResult({ error: e.response?.data || e.message }))
  }, [])

  const startScanner = () => {
    const config = { fps: 10, qrbox: 250 }
    const scanner = new Html5QrcodeScanner('qr-reader', config, false)
    scanner.render((decodedText: string) => {
      onScan(decodedText)
      scanner.clear().catch(() => {})
    }, (err: any) => {})
  }

  return (
    <div>
      <MerchantNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Validar cupones</h1>
        <div className="mb-4">
          <button onClick={startScanner} className="px-3 py-2 bg-blue-600 text-white rounded">Iniciar escáner</button>
        </div>
        <div id="qr-reader" />
        <div className="mt-4">
          <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
