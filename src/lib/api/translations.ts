import type { SiteTranslations } from '@/lib/types/translations'

/**
 * Get site translations and settings
 *
 * NOTE: Currently using hardcoded data. This will be replaced with Laravel API endpoint later.
 * WordPress ACF endpoint (/wp-json/acf/v3/options/options) is not implemented in the back-end yet.
 *
 * @param language - Language code (currently returns Thai data for both locales)
 * @returns Site translations and settings object
 */
export async function getSiteTranslations(language: 'th' | 'en' = 'th'): Promise<SiteTranslations | null> {
  try {
    const normalizedLanguage: 'th' | 'en' = language === 'en' ? 'en' : 'th'

    // TODO: Replace with Laravel API endpoint when implemented
    // Temporary hardcoded data matching WordPress ACF structure
    const hardcodedData: SiteTranslations = {
      acf: {
        address: '101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000',
        bracelet_design_base_price: '1000',
        email: 'info.roihin@gmail.com',
        facebook: 'https://www.facebook.com/roihin42896395',
        google_map: 'https://maps.app.goo.gl/pB7jnagNLEbtJsLG8',
        home_p1: ' "กำไลหินเฉพาะบุคคล" \r\n<span style="font-size: 22px">เปลี่ยนแปลงชีวิตในระดับจิตวิญญาณด้วยศาสตร์ร้อยหินเฉพาะตัว<span>',
        home_p2: 'More Than Value, it\'s Spiritual Worth  \r\n<span class="font-light text-gray-700">"มากกว่าคุณค่าทางใจคือคุณค่าทางจิตวิญญาณ"</span>',
        home_p3: 'ปาฏิหาริย์แห่งหินธรรมชาติ ปรากฎการณ์ก่อตัวผ่านหลักร้อยพันปี ประกอบด้วยธาตุ อุณหภูมิ กาลเวลา "หิน" นั้นจึงทรงภูมิปัญญา เราร้อยเรียงในตำแหน่งหินที่ถูกต้องเหมาะสมเพื่ออานุภาพ ในแง่ของพลังงานที่พร้อมส่งต่อให้กับคุณ\r\n \r\nร้อยหินเชื่อมโยงกำไลหินด้วย คุณงามความดี ขับเคลื่อนความสำเร็จด้วยบุญกุศลและแรงอธิษฐาน เราขอให้ผู้ครอบครองกำไลหินเส้นนี้ จงคิดดี พูดดี ทำดี รักษาศีลให้ครบถ้วนอยู่เสมอ ท่านว่าผู้ใดกระทำเช่นนั้นแล้วจักบังเกิดความสำเร็จสมปราถนาทุกประการ',
        home_p4: 'ชาร์มอันเป็นเอกลักษณ์',
        home_p5: 'ดูชาร์มเพิ่มเติม',
        home_p6: 'ขับเคลื่อนพลังแห่งการเปลี่ยนแปลงชีวิต ด้วยชาร์มอันมีเอกลักษณ์เฉพาะตัว ทุกรูปแบบเปี่ยมด้วยความหมายและคุณค่าอันทรงพลัง ผ่านการสร้างสรรค์ด้วยพิธีกรรมอันศักดิ์สิทธิ์',
        home_p7: 'เสียงตอบรับจากผู้ใช้จริง',
        home_p8: '"เป็นลูกค้าร้านหินของน้องซันมารุ่นแรกๆเลยค่ะ ขอชมจากใจเลยว่างานหินที่น้องเค้าทำออกมาทุกเส้นเป็นงานที่ทำด้วยความตั้งใจ ความเอาใจใส่ ทำให้หินทุกเม็ดที่ร้อยมีคุณค่า สัมผัสได้ถึงพลังงานของความรัก ความอ่อนโยน และไปจนถึงความปรารถนาดีจากผู้ทำที่ส่งต่อผ่านหินมายังผู้ที่เป็นเจ้าของ หินทุกเม็ดที่สมบูรณ์แบบอยู่ที่นี่ มาหาได้ที่ร้อยหินค่ะ" - Ariya Nrd',
        home_p9: 'INSPIRED ROIHIN',
        instagram: 'https://www.instagram.com/roihinth/',
        line: 'https://lin.ee/r94Dnio',
        menu_about_us: 'เกี่ยวกับร้อยหิน',
        menu_blogs: 'บทความ',
        menu_charm_spacer: 'ชาร์ม/สเปเซอร์',
        menu_contact: 'บริการลูกค้า',
        menu_crystal_mineral: 'หิน / แร่',
        menu_diy: 'DIY',
        menu_home: 'หน้าแรก',
        menu_personalized_design: 'งานออกแบบเฉพาะบุคคล',
        menu_shop: 'ร้านค้า',
        menu_testimonial: 'รีวิวจริง',
        phone: '+6683 826 5195',
        pinterest: 'https://www.pinterest.com/Roihin_th/',
        tiktok: 'https://www.tiktok.com/@ceo_roihin',
      },
    }

    const translationsByLanguage: Record<'th' | 'en', SiteTranslations> = {
      th: hardcodedData,
      en: hardcodedData,
    }

    return translationsByLanguage[normalizedLanguage]
  } catch (error) {
    console.error('Error returning site translations:', error)
    return null
  }
}
