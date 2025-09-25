import html2canvas from 'html2canvas'

// Helper function to wait for all images in an element to load
async function waitForImagesToLoad(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img')
  const backgroundImages = element.querySelectorAll<HTMLElement>('[style*="background-image"]')

  const imagePromises: Promise<void>[] = []

  // Wait for img tags
  images.forEach((img) => {
    if (!img.complete) {
      imagePromises.push(
        new Promise((resolve) => {
          img.addEventListener('load', () => resolve())
          img.addEventListener('error', () => resolve()) // Continue even if image fails
        })
      )
    }
  })

  // For background images, we can't easily detect when they're loaded,
  // so we'll add a small delay to ensure they're rendered
  if (backgroundImages.length > 0) {
    imagePromises.push(new Promise(resolve => setTimeout(resolve, 500)))
  }

  await Promise.all(imagePromises)
}

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 100
): Promise<T> {
  let lastError: Error | unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}

export async function generateBraceletThumbnail(element: HTMLElement): Promise<string> {
  try {
    // Wait for all images to load first
    await waitForImagesToLoad(element)

    // Add a small delay to ensure DOM is fully rendered
    await new Promise(resolve => setTimeout(resolve, 300))

    // Try to capture with retry logic
    const captureFunction = async () => {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true, // Allow cross-origin images
        allowTaint: true,
        width: 520,
        height: 360,
        onclone: (clonedDoc) => {
          // Ensure cloned document has all styles applied
          const clonedElement = clonedDoc.querySelector('[data-stage]')
          if (clonedElement) {
            // Force a reflow to ensure all styles are applied
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (clonedElement as HTMLElement).offsetHeight
          }
        },
        imageTimeout: 5000, // Wait up to 5 seconds for images
        removeContainer: false, // Keep the cloned container for debugging
      })

      // Verify the canvas has content (not just white)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const hasContent = imageData.data.some((value, index) => {
          // Check if any pixel is not white (considering RGBA channels)
          if (index % 4 === 3) return false // Skip alpha channel
          return value !== 255
        })

        if (!hasContent) {
          throw new Error('Canvas appears to be empty')
        }
      }

      return canvas
    }

    const canvas = await retryWithBackoff(captureFunction)

    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/png', 0.9)
    return imageData
  } catch (error) {
    console.error('Error generating bracelet thumbnail:', error)
    // Return a fallback placeholder image if generation fails
    return '/images/bracelet-placeholder.png'
  }
}

export function generateBraceletTitle(beadCount: number, wristLength: string, locale: 'en' | 'th'): string {
  if (locale === 'th') {
    return `สร้อยข้อมือออกแบบเอง (${beadCount} หิน, ${wristLength} ซม.)`
  }
  return `Custom Bracelet (${beadCount} stones, ${wristLength} cm)`
}

export function generateBraceletId(): string {
  return `bracelet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}