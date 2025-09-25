import { Container, HeroSkeleton, GridSkeleton, Skeleton } from '@/components/ui'

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section */}
      <HeroSkeleton className="h-[500px] lg:h-[600px]" />

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-16">
              <Skeleton className="w-48 h-10 mx-auto mb-4" />
              <Skeleton className="w-64 h-6 mx-auto" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-full h-5" />
                    <Skeleton className="w-3/4 h-5" />
                  </div>
                ))}
              </div>

              <Skeleton className="w-full h-80 rounded-lg" />
            </div>

            {/* Values Section */}
            <GridSkeleton
              items={3}
              columns={3}
              ItemComponent={() => (
                <div className="text-center p-6 animate-pulse">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="w-24 h-6 mx-auto mb-3" />
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

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="w-32 h-8 mx-auto mb-4" />
              <Skeleton className="w-48 h-5 mx-auto" />
            </div>

            <GridSkeleton
              items={3}
              columns={3}
              ItemComponent={() => (
                <div className="text-center animate-pulse">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="w-24 h-6 mx-auto mb-2" />
                  <Skeleton className="w-20 h-4 mx-auto mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4 mx-auto" />
                  </div>
                </div>
              )}
            />
          </div>
        </Container>
      </section>
    </div>
  )
}