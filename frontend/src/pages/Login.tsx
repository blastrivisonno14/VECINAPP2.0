import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate } from 'react-router-dom'

export default function Login() {
  const { login, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true })
      else if (user.role === 'COMMERCE') navigate('/merchant', { replace: true })
      else navigate('/', { replace: true })
    }
  }, [user, navigate])

  if (user) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error de autenticación')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">Iniciar sesión</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Accediendo...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
