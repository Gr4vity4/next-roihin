import { Container } from '@/components/ui'

export default function CharmSpacerLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section Skeleton */}
      <section className="relative">
        <div className="w-full h-[600px] lg:h-[700px] bg-gray-200 animate-pulse" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Container>
            <div className="text-center space-y-6">
              <div className="w-96 h-14 bg-gray-300 rounded mx-auto animate-pulse" />
              <div className="w-80 h-6 bg-gray-300 rounded mx-auto animate-pulse" />
              <div className="w-44 h-12 bg-gray-300 rounded mx-auto animate-pulse" />
            </div>
          </Container>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-48 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-64 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center animate-pulse">
                  <div className="w-full h-64 bg-gray-200 rounded-lg mb-6" />
                  <div className="w-32 h-8 bg-gray-200 rounded mx-auto mb-3" />
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

      {/* Product Gallery Sections */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className={sectionIndex % 2 === 1 ? 'py-16 bg-gray-50' : 'py-16'}>
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-40 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
                <div className="w-56 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>

              {/* Gallery Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="animate-pulse">
                    <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="w-3/4 h-5 bg-gray-200 rounded" />
                      <div className="w-1/2 h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button Skeleton */}
              <div className="text-center mt-12">
                <div className="w-32 h-10 bg-gray-200 rounded mx-auto animate-pulse" />
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Features Section Skeleton */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-56 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-72 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center p-4 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="w-24 h-5 bg-gray-200 rounded mx-auto mb-2" />
                  <div className="w-full h-4 bg-gray-200 rounded" />
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
            <div className="w-72 h-10 bg-white bg-opacity-20 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-white bg-opacity-20 rounded mx-auto mb-8 animate-pulse" />
            <div className="w-40 h-12 bg-white bg-opacity-20 rounded mx-auto animate-pulse" />
          </div>
        </Container>
      </section>
    </div>
  )
}