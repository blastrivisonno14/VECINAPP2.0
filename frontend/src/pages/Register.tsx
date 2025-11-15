import { FormEvent, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import { getBackendURL } from '../config'

export default function Register() {
  const { register, user, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState<string | null>(null)
  const [backendOk, setBackendOk] = useState<boolean | null>(null)
  const { showToast } = useToast()
  const backendUrl = getBackendURL()

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true })
      else if (user.role === 'COMMERCE') navigate('/merchant', { replace: true })
      else navigate('/', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    axios.get(`${backendUrl}/health`).then(() => setBackendOk(true)).catch(() => setBackendOk(false))
  }, [backendUrl])

  if (user) return <Navigate to='/' replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await register({ name, email, password, role })
      showToast('Registro exitoso', 'success')
      if (role === 'commerce') {
        navigate('/merchant/commerce/new', { replace: true })
      }
    } catch (err: any) {
      let msg: string
      if (err?.response) {
        msg = err.response.data?.error || err.response.data?.message || 'Error en registro'
      } else if (err?.request) {
        msg = 'No se pudo conectar con el backend. Verifica VITE_BACKEND_URL.'
      } else {
        msg = 'Error en registro'
      }
      setError(msg)
      showToast(msg, 'error')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <form onSubmit={onSubmit} className='w-full max-w-sm bg-white shadow rounded p-6 space-y-4'>
        <h1 className='text-xl font-semibold text-gray-800'>Crear cuenta</h1>
        {backendOk === false && (
          <div className='text-xs p-2 rounded bg-red-50 text-red-700 border border-red-200'>
            No se puede contactar al backend en <span className='font-mono'>{backendUrl}</span>. Revisa la variable VITE_BACKEND_URL.
          </div>
        )}
        {error && <div className='text-red-600 text-sm'>{error}</div>}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-gray-700'>Nombre</label>
          <input value={name} onChange={e=>setName(e.target.value)} className='input' />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-gray-700'>Email</label>
          <input type='email' value={email} onChange={e=>setEmail(e.target.value)} required className='input' />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-gray-700'>Contraseña</label>
          <input type='password' value={password} onChange={e=>setPassword(e.target.value)} required className='input' />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-gray-700'>Rol</label>
          <select value={role} onChange={e=>setRole(e.target.value)} className='input'>
            <option value='user'>Usuario</option>
            <option value='commerce'>Comercio</option>
          </select>
        </div>
        <button type='submit' disabled={loading} className='btn btn-primary w-full'>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
        <div className='text-center text-xs text-gray-600'>¿Ya tienes cuenta? <a href='/login' className='text-indigo-600 hover:underline'>Inicia sesión</a></div>
      </form>
    </div>
  )
}
