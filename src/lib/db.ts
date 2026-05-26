import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL
if (!connectionString) console.warn('⚠️  DATABASE_URL not set in .env.local')

export const sql = connectionString ? neon(connectionString) : null
