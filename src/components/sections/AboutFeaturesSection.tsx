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
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="group">
              {/* Feature Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg mb-6 bg-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={feature.image}
                  alt={feature.title.english}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Feature Content */}
              <div className="text-center space-y-3">
                <Typography
                  variant="h4"
                  fontFamily="playfair"
                  align="center"
                  className="text-gray-800 font-semibold tracking-wide"
                >
                  {feature.title.english}
                </Typography>
                
                <Typography
                  variant="body"
                  fontFamily="thai"
                  align="center"
                  color="text-gray-600"
                  className="text-base"
                >
                  {feature.title.thai}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}