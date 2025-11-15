import React, { useState, useEffect } from 'react'
import MerchantNavbar from '../../components/MerchantNavbar'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState<any>({ name: '', email: '' })

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email })
  }, [user])

  const save = async () => {
    // Patch user profile (backend endpoint not implemented in example)
    alert('Guardar perfil: implementar endpoint backend')
  }

  return (
    <div>
      <MerchantNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Perfil del comercio</h1>
        <div className="max-w-md grid gap-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" placeholder="Nombre" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="p-2 border rounded" placeholder="Email" />
          <div className="flex gap-2">
            <button onClick={save} className="px-3 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
