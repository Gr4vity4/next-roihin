import { Container } from '@/components/ui'

export default function CustomerServiceLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Header Section Skeleton */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-64 h-12 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
            <div className="w-80 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
        </Container>
      </section>

      {/* Contact Options Section Skeleton */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-48 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-72 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center p-8 border border-gray-200 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="w-24 h-6 bg-gray-200 rounded mx-auto mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto" />
                  </div>
                  <div className="w-32 h-10 bg-gray-200 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-32 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-48 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-3/4 h-5 bg-gray-200 rounded" />
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Business Hours Section Skeleton */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-40 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-56 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 animate-pulse">
                <div className="w-32 h-6 bg-gray-200 rounded mb-4" />
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>

              <div className="space-y-4 animate-pulse">
                <div className="w-40 h-6 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded mt-1" />
                    <div className="space-y-1 flex-1">
                      <div className="w-full h-4 bg-gray-200 rounded" />
                      <div className="w-2/3 h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded mt-1" />
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded mt-1" />
                    <div className="w-40 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Form Section Skeleton */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-48 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="w-64 h-5 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>

            <div className="bg-white p-8 shadow-sm">
              <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="w-16 h-4 bg-gray-200 rounded mb-2" />
                    <div className="w-full h-10 bg-gray-200 rounded" />
                  </div>
                  <div>
                    <div className="w-12 h-4 bg-gray-200 rounded mb-2" />
                    <div className="w-full h-10 bg-gray-200 rounded" />
                  </div>
                </div>
                
                <div>
                  <div className="w-20 h-4 bg-gray-200 rounded mb-2" />
                  <div className="w-full h-10 bg-gray-200 rounded" />
                </div>
                
                <div>
                  <div className="w-16 h-4 bg-gray-200 rounded mb-2" />
                  <div className="w-full h-32 bg-gray-200 rounded" />
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-12 bg-gray-200 rounded mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}