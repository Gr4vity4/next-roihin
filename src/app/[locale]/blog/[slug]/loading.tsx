import { Container, Typography, HeroSkeleton, ArticleSkeleton, GridSkeleton, Skeleton } from '@/components/ui'

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      {/* Hero Section with Title Overlay */}
      <section className="relative">
        <HeroSkeleton className="h-[400px] lg:h-[500px]" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <Container>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="w-3/4 h-8 lg:h-12 bg-gray-300 rounded-md" />
                <Skeleton className="w-1/2 h-8 lg:h-12 bg-gray-300 rounded-md" />
              </div>

              <div className="flex items-center space-x-4">
                <Skeleton className="w-24 h-4 bg-gray-300" />
                <Skeleton className="w-1 h-1 bg-gray-300 rounded-full" />
                <Skeleton className="w-20 h-4 bg-gray-300" />
                <Skeleton className="w-1 h-1 bg-gray-300 rounded-full" />
                <Skeleton className="w-16 h-4 bg-gray-300" />
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 mb-8">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-1 h-1 rounded-full" />
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-1 h-1 rounded-full" />
              <Skeleton className="w-32 h-4" />
            </div>

            {/* Excerpt */}
            <div className="mb-8 p-6 bg-gray-50 border-l-4 border-gray-200">
              <div className="space-y-2">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-3/4 h-5" />
              </div>
            </div>

            {/* Article Content */}
            <article className="space-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>

                  {index % 3 === 0 && (
                    <Skeleton className="w-1/2 h-6 mt-6 mb-3" />
                  )}
                </div>
              ))}
            </article>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Skeleton className="w-16 h-6 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-16 h-6" />
                ))}
              </div>
            </div>

            {/* Author Info */}
            <div className="mt-8 p-6 bg-gray-50">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12" />
                <div className="space-y-2">
                  <Skeleton className="w-24 h-5" />
                  <Skeleton className="w-40 h-4" />
                </div>
              </div>
            </div>

            {/* Social Share */}
            <div className="mt-8 flex items-center space-x-4">
              <Skeleton className="w-20 h-5" />
              <div className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-10 h-10" />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Skeleton className="w-48 h-8 mx-auto" />
          </div>

          <GridSkeleton
            items={3}
            columns={3}
            ItemComponent={ArticleSkeleton}
          />
        </Container>
      </section>

      {/* Loading Text */}
      <div className="text-center py-8">
        <Typography
          variant="body"
          className="text-gray-500"
        >
          กำลังโหลดบทความ...
        </Typography>
      </div>
    </div>
  )
}