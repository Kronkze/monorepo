import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

export function mandatoryEnv(name: string) {
  const value = process.env[name]
  if (value === undefined) {
    console.error(`Environment variable ${name} is not defined`)
    throw new Error(`Environment variable ${name} is not defined`)
  }
  return value
}

const host = mandatoryEnv('PGHOST')
const port = parseInt(mandatoryEnv('PGPORT'))
const database = mandatoryEnv('PGDATABASE')
const adminUser = mandatoryEnv('PG_ADMIN_USER')
const adminPassword = mandatoryEnv('PG_ADMIN_PASSWORD')

export const pgPool = new pg.Pool({
  host,
  port,
  database,
  user: adminUser,
  password: adminPassword,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function withAdminPgClient<T>(f: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pgPool.connect()
  try {
    return await f(client)
  } finally {
    client.release()
  }
}

export async function inTxn<T>(client: pg.PoolClient, action: () => Promise<T>): Promise<T> {
  await client.query('BEGIN')
  try {
    const t = await action()
    await client.query('COMMIT')
    return t
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  }
}
