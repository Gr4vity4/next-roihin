import { NextResponse } from 'next/server'

/**
 * Health check endpoint for monitoring application status
 * Tests WordPress API connectivity and returns system information
 */
export async function GET() {
  try {
    const startTime = Date.now()
    
    // Test WordPress API connection
    let wpStatus = 'healthy'
    let wpLatency = 0
    
    try {
      const wpStartTime = Date.now()
      // Simple query to test WordPress API connectivity
      const wpApiUrl = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
      const response = await fetch(`${wpApiUrl}/wp-json/wp/v2/posts?per_page=1`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      wpLatency = Date.now() - wpStartTime
      
      if (!response.ok) {
        wpStatus = 'unhealthy'
      }
    } catch (wpError) {
      wpStatus = 'unhealthy'
      console.error('WordPress API health check failed:', wpError)
    }

    const responseTime = Date.now() - startTime

    const healthData = {
      status: wpStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks: {
        wordpress: {
          status: wpStatus,
          latency: `${wpLatency}ms`
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
    // Quick WordPress API connectivity test
    const wpApiUrl = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
    const response = await fetch(`${wpApiUrl}/wp-json/wp/v2/posts?per_page=1`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    
    return new NextResponse(null, { status: response.ok ? 200 : 503 })
  } catch (err) {
    console.error('Health check HEAD error:', err)
    return new NextResponse(null, { status: 503 })
  }
}