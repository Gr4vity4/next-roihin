import Image from 'next/image'
import { getPersonalizedGalleryImages } from '@/lib/api/gallery'
import type { LaravelGalleryImage } from '@/lib/types/laravel'

export default async function PersonalizedGallerySection() {
  // Fetch curated gallery images from Laravel admin via REST API
  const galleryImages = await getPersonalizedGalleryImages()

  // Filter out images without a usable URL
  const imagesWithUrl = galleryImages.filter(
    (image): image is LaravelGalleryImage & { image_url: string } =>
      typeof image.image_url === 'string' && image.image_url.length > 0,
  )

  if (imagesWithUrl.length === 0) {
    return null
  }

  // Shuffle images to ignore admin-defined sort order
  const shuffledImages = [...imagesWithUrl]
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]]
  }

  const displayImages = shuffledImages.slice(0, 10)

  // If no images available, don't render the section
  if (displayImages.length === 0) {
    return null
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      {/* Full-width Gallery Section */}
      <div className="w-full">
        {/* Desktop: 2x5 grid, Tablet: 3-column, Mobile: 2-column */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 lg:gap-3">
          {displayImages.map((image, index) => (
            <div
              key={`gallery-${image.id}`}
              className="relative aspect-[4/3] overflow-hidden bg-gray-100"
            >
              <Image
                src={image.image_url}
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
