import { Container, Typography } from '@/components/ui'

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="w-full h-[400px] lg:h-[500px] bg-gray-200 animate-pulse" />
        
        {/* Title Overlay Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <Container>
            <div className="space-y-4">
              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="w-3/4 h-8 lg:h-12 bg-gray-300 rounded-md animate-pulse" />
                <div className="w-1/2 h-8 lg:h-12 bg-gray-300 rounded-md animate-pulse" />
              </div>
              
              {/* Meta Info Skeleton */}
              <div className="flex items-center space-x-4">
                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
                <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" />
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
                <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" />
                <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Article Content Skeleton */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Excerpt Skeleton */}
            <div className="mb-8 p-6 bg-gray-50 border-l-4 border-gray-200">
              <div className="space-y-2">
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Article Content Skeleton */}
            <article className="space-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  {/* Paragraph Skeleton */}
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  
                  {/* Occasional heading */}
                  {index % 3 === 0 && (
                    <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse mt-6 mb-3" />
                  )}
                </div>
              ))}
            </article>

            {/* Tags Skeleton */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-16 h-6 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Author Info Skeleton */}
            <div className="mt-8 p-6 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Social Share Skeleton */}
            <div className="mt-8 flex items-center space-x-4">
              <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Articles Skeleton */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <div className="w-48 h-8 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white p-6 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  <div className="w-3/4 h-5 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Loading Text */}
      <div className="text-center py-8">
        <Typography 
          variant="body" 
          fontFamily="thai" 
          className="text-gray-500"
        >
          กำลังโหลดบทความ...
        </Typography>
      </div>
    </div>
  )
}