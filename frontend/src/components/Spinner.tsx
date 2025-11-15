import React from 'react'

export default function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
