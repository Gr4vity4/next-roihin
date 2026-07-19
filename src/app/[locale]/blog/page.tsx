import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { BlogHeroSection, BlogPostsSection, Footer } from '@/components/sections'
import { content } from '@/config/content.config'
import type { Metadata } from 'next'
// Configure route segment caching for blog (dynamic content from WordPress API)
// Revalidate every 5 minutes
export const revalidate = 0

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const isThai = locale === 'th'

  const title = isThai
    ? 'บทความพลังหิน | ROIHIN STONE & BRACELET'
    : 'Blog - Stone Wisdom | ROIHIN STONE & BRACELET'
  const description = isThai
    ? 'ค้นพบความรู้เรื่องพลังงานหิน เทคนิคการบำบัด และแนวทางพัฒนาจิตวิญญาณจากบทความของ ROIHIN'
    : 'Discover the ancient wisdom and modern insights of natural stone healing. Learn about stone energy, spiritual practices, and healing techniques.'

  return {
    title,
    description,
    keywords: [
      'stone healing',
      'crystal therapy',
      'spiritual wisdom',
      'natural stones',
      'chakra healing',
      'meditation',
      'energy healing',
      'stone knowledge',
      'พลังหิน',
      'การรักษาด้วยหิน',
      'จักระ',
      'สมาธิ',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: content.blog.hero.backgroundImage,
          width: 1200,
          height: 630,
          alt: isThai
            ? 'บล็อกความรู้พลังหิน - ROIHIN STONE & BRACELET'
            : 'Stone Wisdom Blog - ROIHIN STONE & BRACELET',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [content.blog.hero.backgroundImage],
    },
  }
}

export default function BlogPage() {
  return (
    <>
      <NavigationWithSuspense />

      <main>
        {/* Blog Hero Section */}
        <BlogHeroSection
          backgroundImage={content.blog.hero.backgroundImage}
          backgroundImageMobile={content.blog.hero.backgroundImageMobile}
          title={content.blog.hero.title}
          subtitle={content.blog.hero.subtitle}
        />

        {/* Blog Posts Section */}
        <BlogPostsSection
          title={content.blog.postsSection.title}
          subtitle={content.blog.postsSection.subtitle}
          loadMoreButton={content.blog.postsSection.loadMoreButton}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </>
  )
}
