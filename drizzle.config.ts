import type { Config } from 'drizzle-kit'

const url = process.env.DATABASE_URL || 'file:./local.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  // 'turso' is the drizzle-kit dialect for the libSQL family (matches the
  // 'drizzle-orm/libsql' runtime adapter). It also drives local file: URLs.
  dialect: 'turso',
  dbCredentials: {
    url,
    ...(authToken ? { authToken } : {}),
  },
  verbose: true,
  strict: true,
} satisfies Config
