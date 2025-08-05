import { Container } from '@/components/ui'

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="w-full h-[500px] lg:h-[600px] bg-gray-200 animate-pulse" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Container>
            <div className="text-center space-y-4">
              <div className="w-72 h-12 bg-gray-300 rounded mx-auto animate-pulse" />
              <div className="w-96 h-6 bg-gray-300 rounded mx-auto animate-pulse" />
            </div>
          </Container>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-16">
              <div className="w-48 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-64 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              
              <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Values Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="w-24 h-6 bg-gray-200 rounded mx-auto mb-3" />
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Team Section Skeleton */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-32 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-48 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center animate-pulse">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="w-24 h-6 bg-gray-200 rounded mx-auto mb-2" />
                  <div className="w-20 h-4 bg-gray-200 rounded mx-auto mb-3" />
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}