export function getBackendURL(): string {
  const env = import.meta.env?.VITE_BACKEND_URL as string | undefined
  if (env && env.trim().length > 0) return env.trim()
  // Intentar usar variable global inyectada
  const globalUrl = (window as any).__BACKEND_URL__
  if (globalUrl && typeof globalUrl === 'string') return globalUrl
  // Si está en producción y no se definió, avisar
  const isProd = window.location.hostname !== 'localhost'
  if (isProd) {
    console.warn('BACKEND URL no configurada. Define VITE_BACKEND_URL durante build.')
  }
  return 'http://localhost:4000'
}
