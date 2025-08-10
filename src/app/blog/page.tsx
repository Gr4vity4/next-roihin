import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import { BlogHeroSection, BlogPostsSection, Footer } from '@/components/sections'
import { content } from '@/config/content.config'
import type { Metadata } from 'next'
// Configure route segment caching for blog (dynamic content from WordPress API)
// Revalidate every 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog - Stone Wisdom | ROIHIN STONE & BRACELET',
  description:
    'Discover the ancient wisdom and modern insights of natural stone healing. Learn about stone energy, spiritual practices, and healing techniques.',
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
    title: 'Blog - Stone Wisdom | ROIHIN STONE & BRACELET',
    description: 'Discover the ancient wisdom and modern insights of natural stone healing.',
    type: 'website',
    images: [
      {
        url: content.blog.hero.backgroundImage,
        width: 1200,
        height: 630,
        alt: 'Stone Wisdom Blog - ROIHIN STONE & BRACELET',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Stone Wisdom | ROIHIN STONE & BRACELET',
    description: 'Discover the ancient wisdom and modern insights of natural stone healing.',
    images: [content.blog.hero.backgroundImage],
  },
}

export default function BlogPage() {
  return (
    <>
      <Navigation />

      <main>
        {/* Blog Hero Section */}
        <BlogHeroSection
          backgroundImage={content.blog.hero.backgroundImage}
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
