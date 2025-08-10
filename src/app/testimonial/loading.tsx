import { Container, Typography } from '@/components/ui'

export default function TestimonialLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Page Header Skeleton */}
          <div className="text-center mb-16">
            <div className="w-64 h-10 bg-gray-200 rounded-md mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 rounded-md mx-auto animate-pulse" />
          </div>

          {/* Testimonials Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {Array.from({ length: 9 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 p-6 shadow-sm animate-pulse"
              >
                {/* Star Rating Skeleton */}
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <div
                      key={starIndex}
                      className="w-4 h-4 bg-gray-200 rounded-sm mr-1"
                    />
                  ))}
                </div>

                {/* Testimonial Content Skeleton */}
                <div className="space-y-3 mb-6">
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                </div>

                {/* Customer Info Skeleton */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-3">
                    {/* Avatar Skeleton */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    
                    <div className="space-y-2">
                      {/* Name Skeleton */}
                      <div className="w-20 h-4 bg-gray-200 rounded" />
                      {/* Location Skeleton */}
                      <div className="w-16 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                  
                  {/* Date Skeleton */}
                  <div className="w-24 h-3 bg-gray-200 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section Skeleton */}
          <div className="bg-gray-50 p-8 text-center mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-16 h-12 bg-gray-200 rounded mx-auto mb-2" />
                  <div className="w-24 h-4 bg-gray-200 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section Skeleton */}
          <div className="text-center">
            <div className="w-48 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-72 h-5 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
            <div className="w-40 h-12 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </Container>

      {/* Loading Text */}
      <div className="text-center py-8">
        <Typography 
          variant="body" 
           
          className="text-gray-500"
        >
          กำลังโหลดรีวิวจากลูกค้า...
        </Typography>
      </div>
    </div>
  )
}