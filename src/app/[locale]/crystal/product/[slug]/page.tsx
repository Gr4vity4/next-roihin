'use client'

import { notFound, useParams } from 'next/navigation'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import CrystalProductDetail, {
  CrystalProduct,
} from '@/components/crystal/CrystalProductDetail'
import CrystalRelatedProducts, {
  RelatedCrystalProduct,
} from '@/components/crystal/CrystalRelatedProducts'

// Mock crystal products data
const MOCK_CRYSTAL_PRODUCTS: Record<string, CrystalProduct> = {
  'apatite-1': {
    id: '1',
    slug: 'apatite-1',
    nameEn: 'Apatite',
    nameTh: 'อะพาไทต์',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    properties: {
      priceComplete: 'au, น้ำ',
      chakra: ['จักระลำคอ', 'จักระดาวศีล'],
      zodiacCompatibility: ['ราศีเมษุน', 'ราศีตุลย์', 'ราศีสุนุ'],
      rulingPlanet: 'ดาวพุธ',
      color: ['ฟ้า', 'น้ำเงิน'],
    },
    description: [
      'อะพาไทต์เป็นแร่ฟอสเฟตที่มีสีหลายชนาย มีรูปหลักทรงหกเหลี่ยม อัดแน่นด้วยไออุ่นของโลกนั้นที่ได้ฟูดูโลไลต์ และคอโลไรต์ในเฟลล์ และทำหน้าที่ควบคุมกระดูและการแบนาอสีนู รวมทั้งการกักเก็บและการถลอดล้อยพลังงานของร่า',
      'อะพาไทต์มีบทบาดสีฟ้า ใช้ในการทำงานที่เกี่ยวกับอัตชาตา การเดินทางจากจางจิต (Astral Travel) การทำสนรในระดับสีนรั และกระตุ้นให้เกิดความฝันที่รู้ตัว (Lucid Dreaming) ชื่อ "Apatite" มาจากภาษากรีกที่หมายถึง "การหลอกลวง หรือคำให้ เข้าใจผิด" เนื่องจากมักถูกมักได้ตัวเป็นแร่ชนิดอื่น ๆ',
      'ด้วยความท้อะพาไทต์เป็นแสงฟอสฟอรีสที่เข้มข้น จึงถูกนำมาใช้ในดุลาสาสรกรรม เช่น บีย และในทางจิตจางญาณ อะพาไทต์ช่วยกระตุ้นการเดินโต การพัฒนา ความสมบูรณ์ และความดุลสมบูรณ์ นอกจากนี้ยังช่วยบรรเทาความรู้เกาเวคศัสรา อีกทั้งช่วงยันลูกอันครืดที่งต่องวันร์',
      'อะพาไทต์ลามำเงินก่อเป็นหินยังชนาม (Shamanic Stone) ที่ใช้ในการปกป้องระหว่างการเดินทางจากจิต วินิยาม การเข้าถึงบันทึกอากาซิก (Akashic Records) หรือการทำงานกับอัตชาตา ใช้เพื่อปกป้องผิดผู้มีฝีภาพฟังปีชาง และกระตุ้น การเดินโดมองตูแลงหาความรู้เกาเวคศัสรา อีกทั้งช่วงจั่นดรับตัตวอ',
      'ในชั้งแร่งๆ อะพาไทต์มีค่าความแข็งปะมาณ 5 ตามมาตราโมห์ (Mohs Hardness) เมื่อทำการทดสอบเส้น (Streak Test) จะราชาเป็นเส็นชาว โดยทัวไปพบในดุจสีฟ้าและเขียว จัดอยู่ในกลุ่มฟอสเฟต และมีรูปผลึกเป็นะมบ5ไทนหรือ หกเหลี่ยม',
    ],
    attributes:
      'อะพาไทต์เป็นหินแห้งแรงบันดาลใจและกระพยบนา กึงให้ต้านจิตวิญญาณ ความคิดสร้างสรรค์ และการเสงอกอก ช่วย เชื่อมโยงระหว่างจิตใต้สำนึกกับโลกวัตรา เสริมการสื่อสาร และช่วยรับดุลบุดุลทั้งฝ่ายกายและจารานท์ โดยสีต้าง ๆ จะมีพลัง เอพาหกพเด้ต เช่ น้ำเงินเสริมการสื่อสารและจิตวิญญาณ ส่วนสีเหลืองเสริมความบั่งกั้ง ความมั่นใจ และฬลังคนทาง กายภาพ นอกจากนี้ยังช่วงฬลังไดุต่นเข้มขึนโบระไชยใต้ต้านอืน ๆ อัีดได้ ได้แก่',
  },
  'labradorite-1': {
    id: '2',
    slug: 'labradorite-1',
    nameEn: 'Labradorite',
    nameTh: 'ลาบราดอไรต์',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    properties: {
      priceComplete: 'โมฬกัจฉะ, แก้ว',
      chakra: ['จักระหน้าผาก', 'จักระบานพิษ'],
      zodiacCompatibility: ['ราศีธนู', 'ราศีมีน', 'ราศีกันย์'],
      rulingPlanet: 'ดาวเสาร์',
      color: ['เทา', 'ฟ้า', 'เขียว', 'ทอง'],
    },
    description: [
      'ลาบราดอไรต์เป็นหินที่มีความสวยงามด้วยการเปลี่ยนสีแบบพิเศษ เรียกว่า "Labradorescence" ซึ่งแสดงให้เห็นสีสันที่หลากหลายเมื่อได้รับแสง',
      'หินชนิดนี้ช่วยเสริมสร้างพลังงานทางจิตวิญญาณ เพิ่มความสามารถในการมองเห็นสิ่งที่ซ่อนอยู่ และปกป้องออร่าจากพลังงานลบ',
    ],
    attributes:
      'ลาบราดอไรต์เป็นหินแห่งการเปลี่ยนแปลงและการปกป้อง ช่วยเสริมสร้างสัญชาตญาณ ความคิดสร้างสรรค์ และความมั่นใจในตนเอง',
  },
}

// Mock related products data
const MOCK_RELATED_PRODUCTS: RelatedCrystalProduct[] = [
  {
    id: '1',
    slug: 'apatite-ring-1',
    nameEn: 'Apatite Ring',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '2',
    slug: 'apatite-stone-raw',
    nameEn: 'Apatite Raw Stone',
    nameTh: 'ทำไสคนดอลาคช่ชั่ "รักมั้บนต์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
  {
    id: '3',
    slug: 'apatite-bracelet-1',
    nameEn: 'Apatite Bracelet',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '4',
    slug: 'apatite-beads',
    nameEn: 'Apatite Beads',
    nameTh: 'ทำไสคนดอลาคช่ชั่ "รักมั้บนต์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
  {
    id: '5',
    slug: 'apatite-pendant-1',
    nameEn: 'Apatite Pendant',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '6',
    slug: 'apatite-necklace',
    nameEn: 'Apatite Necklace',
    nameTh: 'ทำไสคนดอลาคช่ชั่ "รักมั้บนต์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
  {
    id: '7',
    slug: 'apatite-drop-pendant',
    nameEn: 'Apatite Drop Pendant',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '8',
    slug: 'apatite-charm-bracelet',
    nameEn: 'Apatite Charm Bracelet',
    nameTh: 'ทำไสคนดอลาคช่ชั่ "รักมั้บนต์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
]

export default function CrystalProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = params.locale as string

  // Get product from mock data
  const product = MOCK_CRYSTAL_PRODUCTS[slug]

  if (!product) {
    notFound()
  }

  return (
    <>
      <NavigationWithSuspense position="static" />

      <main className="min-h-screen bg-white">
        <CrystalProductDetail product={product} locale={locale} />

        <CrystalRelatedProducts
          crystalName={locale === 'th' ? product.nameTh : product.nameEn}
          products={MOCK_RELATED_PRODUCTS}
          locale={locale}
        />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
