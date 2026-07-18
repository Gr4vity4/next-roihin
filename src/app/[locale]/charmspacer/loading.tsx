import { Container, HeroSkeleton, GridSkeleton, GalleryItemSkeleton, Skeleton } from '@/components/ui'

export default function CharmSpacerLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section */}
      <HeroSkeleton />

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Skeleton className="w-48 h-10 mx-auto mb-4" />
              <Skeleton className="w-64 h-6 mx-auto" />
            </div>

            {/* Categories Grid */}
            <GridSkeleton
              items={3}
              columns={3}
              ItemComponent={() => (
                <div className="text-center animate-pulse">
                  <Skeleton className="w-full h-64 rounded-lg mb-6" />
                  <Skeleton className="w-32 h-8 mx-auto mb-3" />
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

      {/* Product Gallery Sections */}
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className={sectionIndex % 2 === 1 ? 'py-16 bg-gray-50' : 'py-16'}>
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Skeleton className="w-40 h-8 mx-auto mb-4" />
                <Skeleton className="w-56 h-5 mx-auto" />
              </div>

              {/* Gallery Grid */}
              <GridSkeleton
                items={8}
                columns={4}
                ItemComponent={GalleryItemSkeleton}
              />

              {/* View More Button */}
              <div className="text-center mt-12">
                <Skeleton className="w-32 h-10 mx-auto" />
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="w-56 h-8 mx-auto mb-4" />
              <Skeleton className="w-72 h-5 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center p-4 animate-pulse">
                  <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="w-24 h-5 mx-auto mb-2" />
                  <Skeleton className="w-full h-4" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#244323] text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="w-72 h-10 bg-white bg-opacity-20 mx-auto mb-4" />
            <Skeleton className="w-96 h-6 bg-white bg-opacity-20 mx-auto mb-8" />
            <Skeleton className="w-40 h-12 bg-white bg-opacity-20 mx-auto" />
          </div>
        </Container>
      </section>
    </div>
  )
}