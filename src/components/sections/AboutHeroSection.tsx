import BaseHeroSection from './BaseHeroSection'

interface AboutHeroSectionProps {
  backgroundImage: string
  backgroundImageMobile?: string
}

export default function AboutHeroSection({ backgroundImage, backgroundImageMobile }: AboutHeroSectionProps) {
  return (
    <BaseHeroSection
      backgroundImage={backgroundImage}
      backgroundImageMobile={backgroundImageMobile}
      backgroundAlt="About ROIHIN Hero Background"
      overlayOpacity={0}
    />
  )
}
