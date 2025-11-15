import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate, Navigate, Link } from 'react-router-dom'

export default function Login() {
  const { login, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

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
      showToast('Inicio de sesión exitoso', 'success')
    } catch (err: any) {
      let msg: string
      if (err?.response) {
        msg = err.response.data?.error || err.response.data?.message || 'Error de autenticación'
      } else if (err?.request) {
        msg = 'No se pudo conectar con el backend. Verifica VITE_BACKEND_URL.'
      } else {
        msg = 'Error de autenticación'
      }
      setError(msg)
      showToast(msg, 'error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm card space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">Iniciar sesión</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" required />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Accediendo...' : 'Entrar'}
        </button>
        <div className="text-center text-xs text-gray-600">
          ¿No tienes cuenta? <Link to="/register" className="text-indigo-600 hover:underline">Regístrate</Link>
        </div>
      </form>
    </div>
  )
}
