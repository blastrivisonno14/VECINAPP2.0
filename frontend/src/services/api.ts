import axios from 'axios'
import type { Promotion } from '../types'
import { getBackendURL } from '../config'

const BACKEND = getBackendURL()

export async function getNearbyPromotions(lat: number, lng: number): Promise<Promotion[]> {
  const res = await axios.get(`${BACKEND}/promotions/nearby`, { params: { lat, lng } })
  return res.data as Promotion[]
}

export async function getAllPromotions(): Promise<Promotion[]> {
  const res = await axios.get(`${BACKEND}/promotions`)
  return res.data as Promotion[]
}

export async function getMyPromotions(token: string) {
  const res = await axios.get(`${BACKEND}/promotions`, { headers: { Authorization: `Bearer ${token}` } })
  return res.data as Promotion[]
}

export async function createPromotion(token: string, payload: any) {
  const res = await axios.post(`${BACKEND}/promotions`, payload, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function updatePromotion(token: string, id: number, payload: any) {
  const res = await axios.patch(`${BACKEND}/promotions/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function validateCoupon(token: string, qrToken: string) {
  const res = await axios.post(`${BACKEND}/coupons/validate`, { token: qrToken }, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function getPromotionById(id: number) {
  const res = await axios.get(`${BACKEND}/promotions/${id}`)
  return res.data
}

export async function createCoupon(token: string, promotionId: number) {
  const res = await axios.post(`${BACKEND}/coupons/${promotionId}/create`, {}, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function getUserCoupons(token: string) {
  const res = await axios.get(`${BACKEND}/coupons/me`, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

// Admin API
export async function adminGetPendingPromotions(token: string) {
  const res = await axios.get(`${BACKEND}/admin/promotions/pending`, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function adminApprovePromotion(token: string, id: number) {
  const res = await axios.patch(`${BACKEND}/admin/promotions/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function adminDeletePromotion(token: string, id: number) {
  const res = await axios.delete(`${BACKEND}/admin/promotions/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function adminGetStats(token: string) {
  const res = await axios.get(`${BACKEND}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function adminListCommerces(token: string) {
  const res = await axios.get(`${BACKEND}/commerces`, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function listCommerces(): Promise<any[]> {
  const res = await axios.get(`${BACKEND}/commerces`)
  return res.data
}

export async function createCommerce(token: string, payload: any) {
  const res = await axios.post(`${BACKEND}/commerces`, payload, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function adminActivateCommerce(token: string, id: number) {
  const res = await axios.patch(`${BACKEND}/admin/commerces/${id}/activate`, {}, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function adminDeactivateCommerce(token: string, id: number) {
  const res = await axios.patch(`${BACKEND}/admin/commerces/${id}/deactivate`, {}, { headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export async function adminSearch(token: string, q: string, type: 'user' | 'commerce' = 'user') {
  const res = await axios.get(`${BACKEND}/admin/search`, { params: { q, type }, headers: { Authorization: `Bearer ${token}` } })
  return res.data
}

export default { getNearbyPromotions, getAllPromotions }
