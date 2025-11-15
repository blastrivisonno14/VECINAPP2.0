import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'

const SECRET = process.env.QR_JWT_SECRET || process.env.JWT_SECRET || 'qr_secret'
const TOKEN_EXP = '24h'

export type QRPayload = {
  couponId: number
  userId?: number | null
  iat?: number
}

export function signQR(payload: QRPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXP })
}

export function verifyQR(token: string): QRPayload {
  const decoded = jwt.verify(token, SECRET) as QRPayload
  return decoded
}

export async function generateQRCodeDataUrl(token: string) {
  // token can be long; encode as data containing the token directly or a URL pointing to frontend redeem route
  // Here we embed the raw token as the QR payload. Frontend scanning returns token to backend for verification.
  const data = token
  const dataUrl = await qrcode.toDataURL(data)
  return dataUrl
}

export default { signQR, verifyQR, generateQRCodeDataUrl }
