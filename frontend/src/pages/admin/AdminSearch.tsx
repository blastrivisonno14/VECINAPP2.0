import React, { useState } from 'react'
import AdminNavbar from './AdminNavbar'
import axios from 'axios'

export default function AdminSearch(){
  const [q, setQ] = useState('')
  const [type, setType] = useState<'user'|'commerce'>('user')
  const [result, setResult] = useState<any>(null)

  const search = async () => {
    const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:4000'
    const res = await axios.get(`${BACKEND}/admin/search`, { params: { q, type } })
    setResult(res.data)
  }

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Buscar</h1>
        <div className="flex gap-2 mb-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="p-2 border rounded flex-1" placeholder="Buscar..." />
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="p-2 border rounded">
            <option value="user">Usuarios</option>
            <option value="commerce">Comercios</option>
          </select>
          <button onClick={search} className="px-3 py-2 bg-blue-600 text-white rounded">Buscar</button>
        </div>
        <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  )
}
