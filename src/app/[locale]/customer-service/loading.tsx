import { Container, FormSkeleton, GridSkeleton, Skeleton } from '@/components/ui'

export default function CustomerServiceLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Header Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="w-64 h-12 mx-auto mb-6" />
            <Skeleton className="w-80 h-6 mx-auto" />
          </div>
        </Container>
      </section>

      {/* Contact Options Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="w-48 h-8 mx-auto mb-4" />
              <Skeleton className="w-72 h-5 mx-auto" />
            </div>

            <GridSkeleton
              items={3}
              columns={3}
              ItemComponent={() => (
                <div className="text-center p-8 border border-gray-200 animate-pulse">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="w-24 h-6 mx-auto mb-3" />
                  <div className="space-y-2 mb-4">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4 mx-auto" />
                  </div>
                  <Skeleton className="w-32 h-10 mx-auto" />
                </div>
              )}
            />
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="w-32 h-8 mx-auto mb-4" />
              <Skeleton className="w-48 h-5 mx-auto" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white border border-gray-200 p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-4 h-4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Business Hours Section */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="w-40 h-8 mx-auto mb-4" />
              <Skeleton className="w-56 h-5 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 animate-pulse">
                <Skeleton className="w-32 h-6 mb-4" />
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                ))}
              </div>

              <div className="space-y-4 animate-pulse">
                <Skeleton className="w-40 h-6 mb-4" />
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-5 h-5 mt-1" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-2/3 h-4" />
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-5 h-5 mt-1" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-5 h-5 mt-1" />
                    <Skeleton className="w-40 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="w-48 h-8 mx-auto mb-4" />
              <Skeleton className="w-64 h-5 mx-auto" />
            </div>

            <FormSkeleton />
          </div>
        </Container>
      </section>
    </div>
  )
}