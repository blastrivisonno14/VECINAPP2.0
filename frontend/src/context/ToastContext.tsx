import React, { createContext, useContext, useCallback, useState } from 'react'

export type Toast = { id: number; message: string; type?: 'success' | 'error' | 'info'; duration?: number }

interface ToastContextValue {
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    const toast: Toast = { id, message, type, duration }
    setToasts(t => [...t, toast])
    if (duration > 0) setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className='fixed top-4 right-4 z-50 space-y-2 w-72'>
        {toasts.map(t => (
          <div key={t.id} className={`card text-sm flex items-start gap-2 border-l-4 ${t.type === 'success' ? 'border-green-500' : t.type === 'error' ? 'border-red-500' : 'border-primary-500'}`}>
            <div className='flex-1'>{t.message}</div>
            <button onClick={() => removeToast(t.id)} className='text-xs text-gray-500 hover:text-gray-700'>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
