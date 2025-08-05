import { Container } from '@/components/ui'

export default function PersonalizedLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="w-full h-[600px] lg:h-[700px] bg-gray-200 animate-pulse" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Container>
            <div className="text-center space-y-6">
              <div className="w-80 h-14 bg-gray-300 rounded mx-auto animate-pulse" />
              <div className="w-96 h-6 bg-gray-300 rounded mx-auto animate-pulse" />
              <div className="w-40 h-12 bg-gray-300 rounded mx-auto animate-pulse" />
            </div>
          </Container>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-64 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-80 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="text-center p-6 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="w-32 h-6 bg-gray-200 rounded mx-auto mb-3" />
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

      {/* Gallery Section Skeleton */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-48 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-64 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            {/* Gallery Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className={`
                    bg-gray-200 animate-pulse
                    ${index % 7 === 0 ? 'col-span-2 row-span-2 h-80' : 'h-40'}
                    ${index % 5 === 0 && index % 7 !== 0 ? 'row-span-2 h-80' : ''}
                  `}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Process Section Skeleton */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-56 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-72 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="space-y-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="w-40 h-6 bg-gray-200 rounded" />
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-gray-200 rounded" />
                      <div className="w-full h-4 bg-gray-200 rounded" />
                      <div className="w-3/4 h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-16 bg-[#006039] text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-64 h-10 bg-white bg-opacity-20 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-80 h-6 bg-white bg-opacity-20 rounded mx-auto mb-8 animate-pulse" />
            <div className="w-48 h-12 bg-white bg-opacity-20 rounded mx-auto animate-pulse" />
          </div>
        </Container>
      </section>
    </div>
  )
}