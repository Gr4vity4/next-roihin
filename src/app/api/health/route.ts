import { NextResponse } from 'next/server'
import { getLaravelApiUrl } from '@/config/api.config'

/**
 * Health check endpoint for monitoring application status
 * Tests Laravel API connectivity and returns system information
 */
export async function GET() {
  try {
    const startTime = Date.now()

    // Test Laravel API connection
    let laravelStatus = 'healthy'
    let laravelLatency = 0

    try {
      const laravelStartTime = Date.now()
      const laravelApiUrl = getLaravelApiUrl()
      const response = await fetch(`${laravelApiUrl}/api/v1/products?per_page=1`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      laravelLatency = Date.now() - laravelStartTime

      if (!response.ok) {
        laravelStatus = 'unhealthy'
      }
    } catch (laravelError) {
      laravelStatus = 'unhealthy'
      console.error('Laravel API health check failed:', laravelError)
    }

    const responseTime = Date.now() - startTime

    const healthData = {
      status: laravelStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks: {
        laravel: {
          status: laravelStatus,
          latency: `${laravelLatency}ms`
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
    // Quick Laravel API connectivity test
    const laravelApiUrl = getLaravelApiUrl()
    const response = await fetch(`${laravelApiUrl}/api/v1/products?per_page=1`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    return new NextResponse(null, { status: response.ok ? 200 : 503 })
  } catch (err) {
    console.error('Health check HEAD error:', err)
    return new NextResponse(null, { status: 503 })
  }
}
