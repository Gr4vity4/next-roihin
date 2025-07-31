import { createClient } from '@libsql/client'

const turso = createClient({
  url: 'libsql://roihin-gr4vity4.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTM5NzM5MDcsImlkIjoiZGZmMzQxMDctY2M4NS00MDM2LWFiYTktZTRmODZjMmU2MTFkIiwicmlkIjoiODc5YmRiYmMtZTk5NC00NDBiLWFhZDYtNzcyN2IzMGZhNTE1In0.NJjtV_bnhnyx2jcivmcCXLpdis4Y2M4UCuLFyWcGBnlyFPhkc0DyvqSCCpNM25uI0ERirdaquwVPajOX6912Dw',
})

async function createTables() {
  try {
    console.log('Creating testimonials table...')
    
    // Create testimonials table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        avatar TEXT NOT NULL,
        date TEXT NOT NULL,
        message TEXT NOT NULL,
        language TEXT DEFAULT 'th',
        is_active INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('Creating site_meta table...')
    
    // Create site_meta table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS site_meta (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meta_key TEXT NOT NULL UNIQUE,
        meta_value TEXT,
        meta_value_json TEXT,
        language TEXT DEFAULT 'th',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('Tables created successfully!')
    
    // Test connection
    const result = await turso.execute('SELECT name FROM sqlite_master WHERE type="table"')
    console.log('Tables in database:', result.rows.map(row => row.name))
    
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

createTables()