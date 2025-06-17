/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GA_TRACKING_ID: string
  readonly VITE_MEMPOOL_API_BASE: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 