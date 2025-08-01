import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import ChatWidget from '@/components/ChatWidget'
import { BlogHeroSection, BlogPostsSection, Footer } from '@/components/sections'
import { contentConfig } from '@/config/content.config'

export const metadata: Metadata = {
  title: 'Blog - Stone Wisdom | ROIHIN STONE & BRACELET',
  description: 'Discover the ancient wisdom and modern insights of natural stone healing. Learn about stone energy, spiritual practices, and healing techniques.',
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
        url: contentConfig.blog.hero.backgroundImage,
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
    images: [contentConfig.blog.hero.backgroundImage],
  },
}

export default function BlogPage() {
  return (
    <>
      <Navigation />

      <main>
        {/* Blog Hero Section */}
        <BlogHeroSection
          backgroundImage={contentConfig.blog.hero.backgroundImage}
          title={contentConfig.blog.hero.title}
          subtitle={contentConfig.blog.hero.subtitle}
        />

        {/* Blog Posts Section */}
        <BlogPostsSection
          title={contentConfig.blog.postsSection.title}
          subtitle={contentConfig.blog.postsSection.subtitle}
          posts={contentConfig.blog.postsSection.posts}
          categories={contentConfig.blog.categories}
          loadMoreButton={contentConfig.blog.postsSection.loadMoreButton}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </>
  )
}