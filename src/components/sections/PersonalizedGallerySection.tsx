import Image from 'next/image'
import { getRandomGalleryPhotos } from '@/lib/api/gallery'

export default async function PersonalizedGallerySection() {
  // Fetch random 10 images from WordPress API
  const galleryImages = await getRandomGalleryPhotos(10)

  // If no images available, don't render the section
  if (galleryImages.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      {/* Full-width Gallery Section */}
      <div className="w-full">
        {/* Desktop: 2x5 grid, Tablet: 3-column, Mobile: 2-column */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-3">
          {galleryImages.map((imageUrl, index) => (
            <div
              key={`gallery-${index}`}
              className="relative aspect-[4/3] overflow-hidden bg-gray-100"
            >
              <Image
                src={imageUrl}
                alt={`Personalized bracelet design ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                // Priority loading for first 6 images (visible above fold)
                priority={index < 6}
                // Lazy loading for remaining images
                loading={index >= 6 ? 'lazy' : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}