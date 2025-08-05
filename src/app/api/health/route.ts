import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Health check endpoint for monitoring application status
 * Tests database connectivity and returns system information
 */
export async function GET() {
  try {
    const startTime = Date.now()
    
    // Test database connection
    let dbStatus = 'healthy'
    let dbLatency = 0
    
    try {
      const dbStartTime = Date.now()
      // Simple query to test database connectivity
      await db.$client.execute('SELECT 1')
      dbLatency = Date.now() - dbStartTime
    } catch (dbError) {
      dbStatus = 'unhealthy'
      console.error('Database health check failed:', dbError)
    }

    const responseTime = Date.now() - startTime

    const healthData = {
      status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`
        },
        api: {
          status: 'healthy',
          responseTime: `${responseTime}ms`
        }
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
        }
      }
    }

    // Return appropriate HTTP status based on health
    const httpStatus = healthData.status === 'healthy' ? 200 : 503

    return NextResponse.json(healthData, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (err) {
    console.error('Health check endpoint error:', err)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: process.env.NODE_ENV === 'development' 
          ? (err as Error).message 
          : 'Internal server error'
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  }
}

// Optionally support HEAD requests for simple up/down checks
export async function HEAD() {
  try {
    // Quick database connectivity test
    await db.$client.execute('SELECT 1')
    return new NextResponse(null, { status: 200 })
  } catch (err) {
    console.error('Health check HEAD error:', err)
    return new NextResponse(null, { status: 503 })
  }
}