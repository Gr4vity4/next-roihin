import { Container, HeroSkeleton, GridSkeleton, Skeleton } from '@/components/ui'

export default function PersonalizedLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section */}
      <HeroSkeleton />

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="w-64 h-10 mx-auto mb-4" />
              <Skeleton className="w-80 h-6 mx-auto" />
            </div>

            <GridSkeleton
              items={6}
              columns={3}
              ItemComponent={() => (
                <div className="text-center p-6 animate-pulse">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="w-32 h-6 mx-auto mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4 mx-auto" />
                  </div>
                </div>
              )}
            />
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="w-48 h-8 mx-auto mb-4" />
              <Skeleton className="w-64 h-5 mx-auto" />
            </div>

            {/* Gallery Grid - Complex layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={`
                    ${index % 7 === 0 ? 'col-span-2 row-span-2 h-80' : 'h-40'}
                    ${index % 5 === 0 && index % 7 !== 0 ? 'row-span-2 h-80' : ''}
                  `}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="w-56 h-10 mx-auto mb-4" />
              <Skeleton className="w-72 h-6 mx-auto" />
            </div>

            <div className="space-y-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-6 animate-pulse">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="w-40 h-6" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-3/4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#006039] text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="w-64 h-10 bg-white bg-opacity-20 mx-auto mb-4" />
            <Skeleton className="w-80 h-6 bg-white bg-opacity-20 mx-auto mb-8" />
            <Skeleton className="w-48 h-12 bg-white bg-opacity-20 mx-auto" />
          </div>
        </Container>
      </section>
    </div>
  )
}