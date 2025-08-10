import { Container, Typography } from '@/components/ui'

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Page Title Skeleton */}
          <div className="text-center mb-12">
            <div className="w-48 h-10 bg-gray-200 rounded-md mx-auto mb-4 animate-pulse" />
            <div className="w-72 h-6 bg-gray-200 rounded-md mx-auto animate-pulse" />
          </div>

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                {/* Article Image Skeleton */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                
                {/* Article Content */}
                <div className="space-y-3">
                  {/* Category Badge */}
                  <div className="w-20 h-6 bg-gray-200 rounded-full" />
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <div className="w-full h-6 bg-gray-200 rounded-md" />
                    <div className="w-3/4 h-6 bg-gray-200 rounded-md" />
                  </div>
                  
                  {/* Excerpt */}
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded-md" />
                    <div className="w-full h-4 bg-gray-200 rounded-md" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded-md" />
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 pt-4">
                    <div className="w-16 h-4 bg-gray-200 rounded-md" />
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <div className="w-20 h-4 bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Text */}
          <div className="text-center mt-12">
            <Typography 
              variant="body" 
              fontFamily="mixed-lang" 
              className="text-gray-500"
            >
              กำลังโหลดบทความ...
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  )
}