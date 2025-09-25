import { Container, Typography, TestimonialSkeleton, GridSkeleton, Skeleton } from '@/components/ui'

export default function TestimonialLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <Skeleton className="w-64 h-10 rounded-md mx-auto mb-4" />
            <Skeleton className="w-96 h-6 rounded-md mx-auto" />
          </div>

          {/* Testimonials Grid */}
          <div className="mb-16">
            <GridSkeleton
              items={9}
              columns={3}
              ItemComponent={TestimonialSkeleton}
            />
          </div>

          {/* Stats Section */}
          <div className="bg-gray-50 p-8 text-center mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <Skeleton className="w-16 h-12 mx-auto mb-2" />
                  <Skeleton className="w-24 h-4 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Skeleton className="w-48 h-8 mx-auto mb-4" />
            <Skeleton className="w-72 h-5 mx-auto mb-6" />
            <Skeleton className="w-40 h-12 mx-auto" />
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