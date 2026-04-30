import type { Config } from 'drizzle-kit'

const url = process.env.DATABASE_URL || 'file:./local.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url,
    ...(authToken ? { authToken } : {}),
  },
  verbose: true,
  strict: true,
} satisfies Config
