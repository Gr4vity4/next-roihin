import { Typography } from '../ui'
import BaseHeroSection from './BaseHeroSection'

interface PersonalizedHeroSectionProps {
  backgroundImage: string
  /** Art-direction variant served below the md breakpoint */
  backgroundImageMobile?: string
  title?: string
  subtitle?: string
  /** Render the centered title/subtitle treatment used by the home page hero */
  centered?: boolean
}

export default function PersonalizedHeroSection({
  backgroundImage,
  backgroundImageMobile,
  title,
  subtitle,
  centered = false,
}: PersonalizedHeroSectionProps) {
  const hasText = Boolean(title || subtitle)

  return (
    <BaseHeroSection
      backgroundImage={backgroundImage}
      backgroundImageMobile={backgroundImageMobile}
      backgroundAlt="Personalized Stone Bracelet Hero Background"
      overlayOpacity={hasText ? 0.1 : 0}
      // Mirror the home hero frame: same nav offset and bottom padding, text anchored at the bottom on md+
      paddingTop={centered ? 'pt-20 lg:pt-[230px]' : undefined}
      className={centered ? 'pb-16 lg:pb-28 h-screen' : undefined}
    >
      {hasText &&
        (centered ? (
          <div className="container mx-auto flex items-end justify-center">
            <div className="px-4 sm:px-8 md:px-12 lg:px-4 max-w-4xl text-center text-white">
              <Typography variant="h2" textShadow className=" font-normal text-2xl md:text-3xl">
                {title}
                {subtitle && (
                  <>
                    <br />
                    <span className="text-sm md:text-2xl">
                      {subtitle}
                    </span>
                  </>
                )}
              </Typography>
            </div>
          </div>
        ) : (
          <div className="container flex justify-center items-center md:items-start mx-auto">
            <div className="px-6 sm:px-8 md:px-12 lg:px-4 max-w-4xl">
              {/* Title */}
              {title && (
                <Typography
                  variant="h1"
                  textShadow
                  color="text-white"
                  className="tracking-wider leading-tight font-normal"
                >
                  {title}
                </Typography>
              )}

              {/* Subtitle */}
              {subtitle && (
                <Typography
                  variant="h3"
                  textShadow
                  color="text-white"
                  className="max-w-3xl mx-auto leading-relaxed tracking-wide font-normal text-lg md:text-2xl"
                >
                  {subtitle}
                </Typography>
              )}
            </div>
          </div>
        ))}
    </BaseHeroSection>
  )
}
