import html2canvas from 'html2canvas'

export async function generateBraceletThumbnail(element: HTMLElement): Promise<string> {
  try {
    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true, // Allow cross-origin images
      allowTaint: true,
      width: 520,
      height: 360,
    })

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