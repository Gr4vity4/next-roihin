import { drizzle } from 'drizzle-orm/libsql'
import { turso } from './config'
import * as schema from './schema'

export const db = drizzle(turso, { schema })

export * from './schema'