import Image from 'next/image'
import { Container, Typography } from '../ui'

interface Feature {
  id: string
  image: string
  title: {
    english: string
    thai: string
  }
}

interface AboutFeaturesSectionProps {
  features: Feature[]
}

export default function AboutFeaturesSection({ features }: AboutFeaturesSectionProps) {
  // Map the features to use local images from /public/images/about/
  const localFeatures = [
    {
      ...features[0],
      image: '/images/about/1.jpeg',
    },
    {
      ...features[1],
      image: '/images/about/2.jpg',
    },
    {
      ...features[2],
      image: '/images/about/3.jpg',
    },
    {
      ...features[3],
      image: '/images/about/4.avif',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localFeatures.map((feature) => (
            <div key={feature.id} className="group">
              {/* Feature Image with Text Overlay */}
              <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={feature.image}
                  alt={feature.title.english}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Text Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Typography
                    variant="h4"
                    fontFamily="playfair"
                    align="center"
                    className="text-white font-semibold tracking-wide mb-2 text-lg md:text-xl"
                  >
                    {feature.title.english}
                  </Typography>

                  <Typography
                    variant="body"
                    fontFamily="thai"
                    align="center"
                    className="text-white/90 text-sm md:text-base leading-relaxed"
                  >
                    {feature.title.thai}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
