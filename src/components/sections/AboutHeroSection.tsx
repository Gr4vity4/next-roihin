import BaseHeroSection from './BaseHeroSection'

interface AboutHeroSectionProps {
  backgroundImage: string
  title: {
    line1: string
    line2: string
    line3: string
  }
}

export default function AboutHeroSection({ backgroundImage, title }: AboutHeroSectionProps) {
  return (
    <BaseHeroSection
      backgroundImage={backgroundImage}
      backgroundAlt="About ROIHIN Hero Background"
      overlayOpacity={0}
    >
      <div className="flex h-full items-center lg:items-start justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-white">
            <span className="block text-[#D4AF37] text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              .. {title.line1}
            </span>
            <span className="block text-white text-2xl md:text-3xl lg:text-4xl font-normal my-4">
              {title.line2} ..
            </span>
          </h1>
        </div>
      </div>
    </BaseHeroSection>
  )
}
