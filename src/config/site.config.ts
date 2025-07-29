export const siteConfig = {
  name: 'ROIHIN STONE & BRACELET',
  description: 'Transform your life on a spiritual level with personalized stone stringing science',
  url: 'https://roihin.com',
  
  // Navigation
  navigation: [
    { label: 'Home', href: '#', labelThai: 'หน้าแรก' },
    { label: 'About', href: '#about', labelThai: 'เกี่ยวกับ' },
    { label: 'Charms', href: '#charms', labelThai: 'ชาร์ม' },
    { label: 'Reviews', href: '#reviews', labelThai: 'รีวิว' },
  ],
  
  // Social Links
  socialLinks: [
    { platform: 'facebook' as const, href: 'https://facebook.com/roihin' },
    { platform: 'instagram' as const, href: 'https://instagram.com/roihin' },
    { platform: 'twitter' as const, href: 'https://twitter.com/roihin' },
  ],
  
  // Contact Information
  contact: {
    address: '101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
    phone: '+66 xx xxx xxxx',
    email: 'info@roihin.com',
  },
  
  // Footer
  footer: {
    columns: [
      {
        title: 'ข้อมูลร้าน',
        links: [
          { text: 'เกี่ยวกับร้อยหิน', href: '#about' },
          { text: 'ประวัติร้าน', href: '#history' },
          { text: 'วิธีการสั่งซื้อ', href: '#how-to-order' },
          { text: 'นโยบายความเป็นส่วนตัว', href: '#privacy' },
        ],
      },
      {
        title: 'บริการลูกค้า',
        links: [
          { text: 'ติดต่อสอบถาม', href: '#contact' },
          { text: 'การจัดส่ง', href: '#shipping' },
          { text: 'การคืนสินค้า', href: '#returns' },
          { text: 'การดูแลรักษา', href: '#care' },
        ],
      },
      {
        title: 'คอร์สเรียน',
        links: [
          { text: 'คอร์สร้อยหิน', href: '#courses' },
          { text: 'คอร์สออนไลน์', href: '#online-courses' },
          { text: 'วิเคราะห์ดวงชะตา', href: '#horoscope' },
          { text: 'บทความ', href: '#articles' },
        ],
      },
    ],
    copyright: '© 2021 All rights is reserved by Roihin Stone and Bracelet',
  },
}