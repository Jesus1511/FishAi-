// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xszjtninjtzirxxbjape.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzemp0bmluanR6aXJ4eGJqYXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDkzNzYsImV4cCI6MjA2NzEyNTM3Nn0.4qTMmAOVPjcWbD0fl-16LQ903B-1MNEHkgYFzdOk_Y0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
