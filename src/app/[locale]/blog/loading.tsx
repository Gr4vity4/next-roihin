import { Container, Typography, ArticleSkeleton, GridSkeleton, Skeleton } from '@/components/ui'

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Page Title Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="w-48 h-10 rounded-md mx-auto mb-4" />
            <Skeleton className="w-72 h-6 rounded-md mx-auto" />
          </div>

          {/* Blog Grid */}
          <GridSkeleton
            items={6}
            columns={3}
            ItemComponent={ArticleSkeleton}
          />

          {/* Loading Text */}
          <div className="text-center mt-12">
            <Typography
              variant="body"
              className="text-gray-500"
            >
              กำลังโหลดบทความ...
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  )
}