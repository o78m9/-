export type CustomerStatus = 'active' | 'at-risk' | 'dormant' | 'lost' | 'vip'

export interface Clinic {
  id: string
  name: string
  owner: string | null
  phone: string | null
  created_at: string
}

export interface Customer {
  id: string
  clinic_id: string
  name: string
  phone: string
  email: string | null
  first_visit: string | null
  last_visit: string | null
  total_spent: number
  status: CustomerStatus
  tags: string[] | null
  notes: string | null
  created_at: string
}

export interface Visit {
  id: string
  customer_id: string
  date: string
  service: string | null
  amount: number | null
  notes: string | null
  created_at: string
}

export interface ImportedCustomer {
  name: string
  phone: string
  last_visit?: string | null
  notes?: string | null
}
