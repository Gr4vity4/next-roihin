import Image from 'next/image'

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
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="About ROIHIN Hero Background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-white">
            <span className="block text-[#D4AF37] text-4xl md:text-4xl lg:text-6xl font-light tracking-[0.2em] mb-2">
              .. {title.line1}
            </span>
            <span className="block text-white text-3xl md:text-4xl lg:text-5xl font-normal tracking-[0.25em] my-4">
              {title.line2} ..
            </span>
          </h1>
        </div>
      </div>
    </section>
  )
}
