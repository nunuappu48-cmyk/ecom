import { neon } from '@neondatabase/serverless'

const connectionString = import.meta.env.VITE_NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_v0ulgMm9nyfH@ep-winter-hat-b4fx57jq-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require'

export const neonSql = connectionString ? neon(connectionString) : null
