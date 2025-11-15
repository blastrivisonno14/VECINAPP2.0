export type Promotion = {
  id: number
  commerceId: number
  title: string
  description?: string
  imageUrl?: string
  discountType?: string
  discountValue?: number
  startDate?: string
  endDate?: string
  daysOfWeek?: string[]
  maxCoupons?: number
  remainingCoupons?: number
  isActive?: boolean
  lat?: number
  lng?: number
}

export type Commerce = {
  id: number
  ownerId: number
  name: string
  address: string
  lat?: number
  lng?: number
  category?: string
  logoUrl?: string
}
