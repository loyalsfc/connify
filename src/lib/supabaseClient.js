import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPERBASE_URL, process.env.NEXT_PUBLIC_ANON_KEY)