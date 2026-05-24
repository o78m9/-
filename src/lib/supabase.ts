import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url?.startsWith('http')) {
  console.warn('⚠️  NEXT_PUBLIC_SUPABASE_URL not set — add real value to .env.local')
}

export const supabase = (url?.startsWith('http') && key)
  ? createClient(url, key)
  : null
