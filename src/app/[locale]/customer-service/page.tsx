'use client'

import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import Footer from '@/components/sections/Footer'
import { Container, Typography } from '@/components/ui'
import { ChevronDown } from 'lucide-react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useId, useState } from 'react'

function AccordionItem({ title, body }: { title: string; body: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = useId()

  return (
    <div className="border-b border-gray-200">
      <h3>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex w-full items-center justify-between gap-4 py-4 text-left group"
        >
          <span className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
            {title}
          </span>
          <ChevronDown
            className={`w-5 h-5 flex-none text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h3>
      <div
        id={contentId}
        aria-hidden={!isOpen}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-gray-600 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  )
}

export default function CustomerServicePage() {
  const locale = useLocale()
  const isThai = locale === 'th'

  const content = isThai
    ? {
        heroAlt: 'บริการลูกค้า',
        contactTitle: 'ติดต่อสอบถาม',
        addressLabel: 'ที่อยู่:',
        address: `ร้อยหิน Stone & Bracelet
101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อำเภอเมืองภูเก็ต จังหวัดภูเก็ต 83000`,
        phoneLabel: 'โทรศัพท์:',
        phone: '+6683 826 5195',
        emailLabel: 'อีเมล์:',
        email: 'info.roihin@gmail.com',
        mapTitle: 'แผนที่ร้านร้อยหิน Stone & Bracelet',
        ctaTitle: 'ปรึกษาและออกแบบให้ฟรี',
        ctaDescription:
          'ปรึกษาทีมงานผู้เชี่ยวชาญเพื่อออกแบบกำไลหินหรือสอบถามหินมาใหม่เพิ่มเติมได้ที่ (LINE OA : @roihin4289) ติดต่อ Call Center โทร ',
        ctaPhone: '083-159-1926',
        ctaLineButton: 'LINE OA @roihin4289',
        ctaWhatsAppButton: 'WhatsApp',
        faqTitle: 'คำถามที่พบบ่อย (FAQ) — ร้อยหิน',
        faqCategories: [
          {
            title: 'เกี่ยวกับสินค้า',
            items: [
              {
                question: 'กำไลหินของร้อยหินต่างจากที่อื่นอย่างไร?',
                answer:
                  'ร้อยหินออกแบบกำไลแบบเฉพาะบุคคล โดยคัดเลือกหินให้เหมาะกับวันเกิดและเป้าหมายของแต่ละคน ผ่านกระบวนการ 5 ขั้นตอน คือ สอบถามและให้คำปรึกษา คัดสรรหิน ออกแบบพลังงาน เสริมพิธีกรรม และส่งมอบการเปลี่ยนแปลง ไม่ใช่แค่เครื่องประดับทั่วไป แต่เป็นเครื่องเสริมพลังที่ออกแบบมาเพื่อคุณโดยเฉพาะ',
              },
              {
                question: 'จะรู้ได้อย่างไรว่าควรใส่หินชนิดไหน?',
                answer:
                  'แจ้งวันเกิดและสิ่งที่อยากเสริม เช่น การงาน ความรัก สุขภาพ หรือโชคลาภ ทีมงานจะช่วยแนะนำหินที่เหมาะสมให้ หรือสามารถทักแชทเข้ามาปรึกษาก่อนสั่งซื้อได้เลย ผ่านทางไลน์ @roihin4289',
              },
              {
                question: 'กำไลทำจากหินแท้หรือไม่?',
                answer:
                  'หินทุกเม็ดที่ร้อยหินใช้เป็นหินธรรมชาติแท้ ผ่านการคัดสรรคุณภาพก่อนนำมาร้อยเป็นกำไล',
              },
            ],
          },
          {
            title: 'การสั่งซื้อและการชำระเงิน',
            items: [
              {
                question: 'สั่งทำกำไลเฉพาะบุคคลได้อย่างไร?',
                answer:
                  'แจ้งวันเกิด ขนาดข้อมือ และเป้าหมายที่ต้องการเสริม ทางร้านจะออกแบบและจัดชุดหินให้เหมาะกับคุณโดยเฉพาะ ราคาเริ่มต้นที่ 990 บาท',
              },
              {
                question: 'ชำระเงินช่องทางไหนได้บ้าง?',
                answer:
                  'รองรับการโอนเงินผ่านธนาคาร พร้อมเพย์ และการชำระผ่าน Payment Gateway : Stripe ได้',
              },
              {
                question: 'สั่งซื้อผ่านช่องทางไหนได้บ้าง?',
                answer:
                  'สามารถสั่งซื้อได้ผ่าน Line OA, Facebook, Instagram, Roihin Website หรือเดินทางมาเลือกด้วยตัวเองที่หน้าร้าน',
              },
            ],
          },
          {
            title: 'การจัดส่ง',
            items: [
              {
                question: 'ใช้เวลาผลิตและจัดส่งนานแค่ไหน?',
                answer:
                  'เนื่องจากกำไลแต่ละเส้นทำขึ้นเฉพาะบุคคล จึงใช้เวลาผลิตประมาณ 5 - 7 วันทำการ และกำไลหินคอเลคชั่น ใช้เวลาผลิต 1 - 2 วันทำการ หลังจากนั้นจะจัดส่งผ่านบริษัทขนส่งพร้อมเลขพัสดุให้ติดตามสถานะได้',
              },
              {
                question: 'จัดส่งต่างประเทศได้หรือไม่?',
                answer:
                  'ได้ โดยลูกค้ารับผิดชอบค่าจัดส่งด้วยตัวเอง เว้นแต่การจัดส่งในประเทศ ซึ่งร้อยหินจะดำเนินการให้ฟรี',
              },
            ],
          },
          {
            title: 'การดูแลรักษาและการรับประกัน',
            items: [
              {
                question: 'ดูแลรักษากำไลหินอย่างไรให้คงพลังงานและอายุการใช้งานยาวนาน?',
                answer:
                  'หลีกเลี่ยงการสัมผัสน้ำหอม สารเคมี และการกระแทกแรง ๆ ควรถอดก่อนอาบน้ำหรือออกกำลังกาย และหมั่นล้างพลังงานหินเป็นระยะตามคำแนะนำที่แนบมากับสินค้า',
              },
              {
                question: 'ชาร์มเงินแท้ทำไมมีคราบดำ แก้ไขอย่างไร?',
                answer:
                  'เครื่องประดับเงินแท้เมื่อสัมผัสอากาศจะเกิดปฏิกิริยากับซัลเฟอร์ ทำให้เกิดคราบดำคล้ายสนิมได้ตามธรรมชาติ ร้อยหินจึงเคลือบชาร์มเงินแท้ด้วยโรเดียม (White Rhodium หรือทองคำขาว) เพื่อยืดอายุการใช้งาน ลดการเกิดคราบดำ และเพิ่มความเงางามให้ชาร์มสวยคงทนยิ่งขึ้น',
              },
              {
                question: 'หากกำไลขาดหรือชำรุด ทำอย่างไรได้บ้าง?',
                answer:
                  'ติดต่อทางร้านผ่าน Line OA พร้อมแจ้งอาการและรูปสินค้า ทางร้านมีบริการร้อยใหม่/ซ่อมแซมภายในเงื่อนไขที่กำหนด',
              },
              {
                question: 'เปลี่ยนหรือคืนสินค้าได้หรือไม่?',
                answer:
                  'เนื่องจากกำไลผลิตเฉพาะบุคคล จึงไม่รับเปลี่ยนคืนกรณีไม่ชอบ ยกเว้นกรณีสินค้าชำรุดจากการผลิต โดยต้องแจ้งภายใน 7 วันหลังได้รับสินค้า',
              },
            ],
          },
        ],
        warrantyTitle: 'เงื่อนไขการรับประกันสินค้าเครื่องประดับและอุปกรณ์เสริม',
        warrantyItems: [
          {
            heading: 'ระยะเวลาความคุ้มครอง',
            body: 'การรับประกันนี้ครอบคลุมสินค้าที่ซื้อเป็นระยะเวลา 90 วัน นับจากวันที่ซื้อสินค้า',
          },
          {
            heading: 'ขอบเขตการรับประกัน',
            body: 'การรับประกันนี้ครอบคลุมความบกพร่องด้านวัสดุและฝีมือการผลิตภายใต้การใช้งานปกติ ไม่ครอบคลุมความเสียหายที่เกิดจากอุบัติเหตุ การใช้งานผิดวิธี การโจรกรรม การดัดแปลงโดยไม่ได้รับอนุญาต หรือการสึกหรอตามธรรมชาติ',
          },
          {
            heading: 'หลักฐานการซื้อสินค้า',
            body: 'ในการเรียกร้องสิทธิ์ตามการรับประกันนี้ ต้องแสดงใบเสร็จรับเงินต้นฉบับหรือหลักฐานการซื้อสินค้า',
          },
          {
            heading: 'บริการภายใต้การรับประกัน',
            body: 'หากพบว่าสินค้ามีข้อบกพร่องภายในระยะเวลาการรับประกัน ROIHIN จะพิจารณาซ่อมแซมหรือเปลี่ยนสินค้าให้ใหม่โดยไม่คิดค่าใช้จ่าย ทั้งนี้ขึ้นอยู่กับดุลยพินิจของบริษัท',
          },
          {
            heading: 'ข้อยกเว้น',
            body: 'ความเสียหายใดๆ ที่เกิดจากน้ำหรือของเหลว การสัมผัสอุณหภูมิที่รุนแรง การจับต้องอย่างไม่เหมาะสม หรือการใช้งานในทางที่ผิดทุกรูปแบบ จะทำให้การรับประกันนี้เป็นโมฆะ',
          },
          {
            heading: 'ข้อจำกัดความรับผิด',
            body: 'ความรับผิดของ ROIHIN ภายใต้การรับประกันนี้จำกัดอยู่เพียงการซ่อมแซมหรือเปลี่ยนสินค้าที่มีข้อบกพร่องเท่านั้น ทางบริษัทไม่รับผิดชอบต่อความเสียหายทางอ้อม ความเสียหายที่เกิดขึ้นโดยบังเอิญ หรือความเสียหายที่เป็นผลสืบเนื่องใดๆ',
          },
          {
            heading: 'การโอนสิทธิ์',
            body: 'การรับประกันนี้ไม่สามารถโอนสิทธิ์ได้ และมีผลใช้ได้เฉพาะกับผู้ซื้อรายแรกเท่านั้น',
          },
          {
            heading: 'การเรียกร้องสิทธิ์',
            body: 'สำหรับบริการหรือการเรียกร้องสิทธิ์ตามการรับประกัน กรุณาติดต่อฝ่ายบริการลูกค้าที่อีเมล info@roihin.com',
          },
          {
            heading: 'สิทธิ์ตามกฎหมาย',
            body: 'การรับประกันโดยนัยใดๆ รวมถึงการรับประกันในเรื่องความสามารถในเชิงพาณิชย์และความเหมาะสมสำหรับวัตถุประสงค์เฉพาะ จะถูกจำกัดตามระยะเวลาของการรับประกันนี้ บางเขตอำนาจศาลอาจไม่อนุญาตให้จำกัดระยะเวลาของการรับประกันโดยนัย ดังนั้นข้อจำกัดข้างต้นอาจไม่มีผลบังคับใช้กับท่าน',
          },
          {
            heading: 'กฎหมายที่ใช้บังคับ',
            body: 'การรับประกันนี้อยู่ภายใต้บังคับของกฎหมายไทย โดยไม่คำนึงถึงหลักการขัดกันแห่งกฎหมาย',
          },
        ],
        tipsTitle: 'เคล็ดลับการดูแลสร้อยข้อมือคริสตัล',
        tipsImageAlt: 'สร้อยข้อมือคริสตัลจากร้อยหิน Stone & Bracelet',
        tips: [
          {
            heading: 'การทำความสะอาดสร้อยข้อมือ',
            body: 'เช็ดสร้อยข้อมือเบาๆ ด้วยผ้านุ่มชุบน้ำหมาดๆ เพื่อขจัดฝุ่นและคราบมันจากผิวหนัง หลีกเลี่ยงการใช้สารเคมีรุนแรงหรือวัสดุขัดถูที่อาจทำให้คริสตัลเป็นรอย',
          },
          {
            heading: 'การชำระล้างพลังงาน',
            body: 'คริสตัลสามารถดูดซับพลังงานจากสภาพแวดล้อมรอบตัวได้ ดังนั้นจึงควรชำระล้างพลังงานเป็นประจำ สามารถทำได้โดยวางสร้อยข้อมือไว้กลางแสงจันทร์ค้างคืน รมควันด้วยเสจ (sage) หรือวางไว้บนแผ่นชาร์จพลังงานเซเลไนต์ (selenite)',
          },
          {
            heading: 'การจับต้องดูแลทางกายภาพ',
            body: 'ควรจับต้องสร้อยข้อมือด้วยความระมัดระวัง หลีกเลี่ยงการทำตกหรือกระแทกกับพื้นผิวแข็ง เพราะคริสตัลธรรมชาติมีความเปราะบางและอาจแตกหรือบิ่นได้ง่าย',
          },
          {
            heading: 'การจัดเก็บสร้อยข้อมือ',
            body: 'เมื่อไม่ได้สวมใส่ ควรเก็บสร้อยข้อมือไว้ในถุงผ้านุ่มหรือกล่องเครื่องประดับ เพื่อป้องกันรอยขีดข่วนจากเครื่องประดับชิ้นอื่น รวมถึงเก็บให้พ้นจากแสงแดดโดยตรง เพื่อป้องกันไม่ให้คริสตัลบางชนิดสีซีดจาง',
          },
          {
            heading: 'การหลีกเลี่ยงน้ำและสารเคมี',
            body: 'ควรเก็บสร้อยข้อมือคริสตัลให้ห่างจากการสัมผัสน้ำเป็นเวลานาน เพราะอาจทำให้วัสดุของสายเสื่อมสภาพ และส่งผลต่อคริสตัลที่ละลายน้ำได้ เช่น เซเลไนต์ นอกจากนี้ควรหลีกเลี่ยงการสัมผัสกับสารเคมีที่พบในน้ำหอม โลชั่น และผลิตภัณฑ์ทำความสะอาดต่างๆ',
          },
          {
            heading: 'การชาร์จพลังงานคริสตัลใหม่',
            body: 'เพื่อฟื้นฟูพลังงานของสร้อยข้อมือ ให้วางไว้บนกลุ่มแร่หรือโกไดต์ของควอตซ์ใส (clear quartz) หรืออเมทิสต์ (amethyst) ซึ่งเป็นที่รู้จักกันดีในเรื่องความสามารถในการชำระล้างและชาร์จพลังงานให้คริสตัลชนิดอื่น นอกจากนี้ การทำสมาธิพร้อมกับสวมสร้อยข้อมือก็สามารถช่วยปรับสมดุลพลังงานของสร้อยได้เช่นกัน',
          },
        ],
      }
    : {
        heroAlt: 'Customer Service',
        contactTitle: 'Contact Us',
        addressLabel: 'Address:',
        address: `Roihin Stone & Bracelet
101/54 Passorn 70 Village (Ko Kaew), Village No. 4, Ko Kaew Subdistrict, Mueang Phuket District, Phuket 83000`,
        phoneLabel: 'Phone:',
        phone: '+6683 826 5195',
        emailLabel: 'Email:',
        email: 'info.roihin@gmail.com',
        mapTitle: 'Roihin Stone & Bracelet location map',
        ctaTitle: 'Free Consultation & Design',
        ctaDescription:
          'Consult our expert team to design your stone bracelet or ask about new arrivals via LINE OA : @roihin4289, or contact our Call Center at ',
        ctaPhone: '083-159-1926',
        ctaLineButton: 'LINE OA @roihin4289',
        ctaWhatsAppButton: 'WhatsApp',
        faqTitle: 'Frequently Asked Questions (FAQ) — ROIHIN',
        faqCategories: [
          {
            title: 'About the Products',
            items: [
              {
                question: "What makes ROIHIN's crystal bracelets different from others?",
                answer:
                  "ROIHIN designs personalized bracelets by selecting crystals to match each person's birth date and goals, through a Five-step process: Consulting, Crystal Curating, Energy Design, Empowering Ritual, and Delivering Transformation. These aren't just accessories — they're energy pieces designed specifically for you.",
              },
              {
                question: 'How do I know which crystals are right for me?',
                answer:
                  "Share your birth date and what you'd like to enhance — career, love, health, or fortune — and our team will recommend the crystals that suit you best. You're also welcome to message us via LINE Official @roihin4289 for a consultation before ordering.",
              },
              {
                question: 'What does each crystal mean?',
                answer:
                  "Each type of crystal carries its own energy and meaning — some enhance fortune, love, wisdom, or protect against negative energy. Full details on each crystal's meaning are available on the product page.",
              },
              {
                question: 'Are the crystals genuine?',
                answer:
                  'Every crystal ROIHIN uses is genuine and natural, carefully selected for quality before being strung into a bracelet.',
              },
            ],
          },
          {
            title: 'Ordering & Payment',
            items: [
              {
                question: 'How do I order a personalized bracelet?',
                answer:
                  "Share your birth date, wrist size, and the goal you'd like to enhance, and we'll design and curate a set of crystals made specifically for you. Prices start at 990 baht.",
              },
              {
                question: 'What payment methods are available?',
                answer:
                  'We accept bank transfer, PromptPay, and payments through payment gateway (Stripe).',
              },
              {
                question: 'Where can I place an order?',
                answer:
                  'You can order through Line OA, Facebook, Instagram, ROIHIN Website, or visit our store in person.',
              },
            ],
          },
          {
            title: 'Shipping',
            items: [
              {
                question: 'How long does production and shipping take?',
                answer:
                  "Since Personalized Bracelet is made to order, production takes approximately 5 - 7 business days and Collection bracelet takes approximately 1 - 2 business days. Once ready, it's shipped via courier with a tracking number provided.",
              },
              {
                question: 'Do you ship internationally?',
                answer:
                  'Yes, ROIHIN ships both domestically and internationally. Domestic shipping within Thailand is free of charge; for international orders, the customer is responsible for the shipping cost.',
              },
            ],
          },
          {
            title: 'Care & Warranty',
            items: [
              {
                question:
                  'How should I care for my crystal bracelet to preserve its energy and lifespan?',
                answer:
                  "Avoid contact with perfume, chemicals, and hard impacts. Remove the bracelet before showering or exercising, and cleanse the crystals' energy periodically following the care instructions included with your order.",
              },
              {
                question:
                  'Why does the sterling silver charm develop black stains, and how is it prevented?',
                answer:
                  'Genuine silver naturally reacts with sulfur in the air, which causes a dark, rust-like tarnish over time. To prevent this, ROIHIN plates its sterling silver charms with rhodium (White Rhodium / white gold), extending their lifespan, minimizing tarnish, and giving the charm a brighter, more lasting shine.',
              },
              {
                question: 'What if my bracelet breaks or gets damaged?',
                answer:
                  'Contact us via Line OA with a description and photo of the issue. We offer restringing/repair services under our stated conditions.',
              },
              {
                question: 'Can I exchange or return an item?',
                answer:
                  "Since each bracelet is made to order, we don't accept returns or exchanges for change of mind — except in cases of a manufacturing defect, which must be reported within 7 days of receiving the item.",
              },
            ],
          },
        ],
        warrantyTitle: 'Warranty Conditions for ROIHIN Jewelry and Accessories',
        warrantyItems: [
          {
            heading: 'Coverage Duration',
            body: 'This warranty covers the purchased item for a period of 90 days from the date of purchase.',
          },
          {
            heading: 'Scope of Warranty',
            body: 'This warranty covers defects in material and craftsmanship under normal use. It does not cover damage caused by accidents, misuse, theft, unauthorized modifications, or natural wear and tear.',
          },
          {
            heading: 'Proof of Purchase',
            body: 'To claim under this warranty, the original purchase receipt or proof of purchase is required.',
          },
          {
            heading: 'Warranty Services',
            body: 'If a product is found to be defective within the warranty period, ROIHIN will, at its discretion, repair or replace the product at no charge.',
          },
          {
            heading: 'Exclusions',
            body: 'Any damage to the product resulting from water or liquid damage, exposure to extreme temperatures, improper handling, or any form of misuse will void this warranty.',
          },
          {
            heading: 'Limitation of Liability',
            body: "ROIHIN's liability under this warranty is limited to the repair or replacement of the defective product. We are not responsible for any indirect, incidental, or consequential damages.",
          },
          {
            heading: 'Transference',
            body: 'This warranty is non-transferable and is only valid for the original purchaser.',
          },
          {
            heading: 'Claims',
            body: 'For warranty service or claims, please contact customer service at info@roihin.com',
          },
          {
            heading: 'Rights',
            body: 'Any implied warranties, including warranties of merchantability and fitness for a particular purpose, shall be limited to the duration of this warranty. Some jurisdictions do not allow limitations on how long an implied warranty lasts, so the above limitation may not apply to you.',
          },
          {
            heading: 'Governing Law',
            body: 'This warranty is governed by the laws of Thailand without regard to its conflicts of laws principles.',
          },
        ],
        tipsTitle: 'Crystal Wearing Tips',
        tipsImageAlt: 'Crystal bracelet from Roihin Stone & Bracelet',
        tips: [
          {
            heading: 'Cleaning the Bracelet',
            body: 'Gently wipe the bracelet with a soft, damp cloth to remove dust and oils from the skin. Avoid using harsh chemicals or abrasive materials that could scratch the crystals.',
          },
          {
            heading: 'Energetic Cleansing',
            body: "Crystals can absorb energy from their surroundings, so it's important to cleanse them regularly. You can cleanse your bracelet by placing it under moonlight overnight, smudging it with sage, or placing it on a selenite charging plate.",
          },
          {
            heading: 'Physical Handling',
            body: 'Handle your bracelet with care. Avoid dropping it or knocking it against hard surfaces as natural crystals can be fragile and prone to chipping or cracking.',
          },
          {
            heading: 'Storing the Bracelet',
            body: 'When not in use, store your bracelet in a soft pouch or a jewelry box to protect it from being scratched by other pieces of jewelry. Keeping it out of direct sunlight will also prevent some crystals from fading.',
          },
          {
            heading: 'Avoiding Water and Chemicals',
            body: 'Keep your crystal bracelet away from prolonged exposure to water, which can degrade the material of the band and affect water-soluble crystals like selenite. Also, avoid contact with chemicals found in perfumes, lotions, and cleaning products.',
          },
          {
            heading: 'Recharging the Crystals',
            body: "To rejuvenate your bracelet's energy, place it on a cluster or geode of clear quartz or amethyst. These crystals are known for their ability to cleanse and recharge other crystals. Alternatively, meditation with the bracelet can also help in re-aligning its energies.",
          },
        ],
      }

  return (
    <>
      <NavigationWithSuspense />

      {/* Main content wrapper with top padding to account for navigation */}
      <main className="pt-20 min-[1408px]:pt-[230px]">
        {/* Full Width Image Section */}
        <section className="relative w-full h-[420px] overflow-hidden">
          <Image
            src="/images/357c3a_ac4bc1a787364c358512be32cc1ffc30~mv2.avif"
            alt={content.heroAlt}
            fill
            className="object-cover"
            priority
          />
          {/* Dark backdrop matching the home hero overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20 lg:py-28 border border-gray-100">
          <Container>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Typography variant="h3" align="center" className="text-gray-900">
                {content.ctaTitle}
              </Typography>

              <Typography variant="body" align="center" className="text-gray-900">
                {content.ctaDescription}
                <strong>{content.ctaPhone}</strong>
              </Typography>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href="https://lin.ee/r94Dnio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#244323]"
                >
                  {content.ctaLineButton}
                </a>
                <a
                  href="https://wa.me/66831591926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#244323]"
                >
                  {content.ctaWhatsAppButton}
                </a>
              </div>
            </div>
          </Container>
        </section>

        

        {/* Crystal Wearing Tips Section */}
        <section className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Full Image */}
            <div className="relative h-[350px] sm:h-[420px] lg:h-auto lg:min-h-[560px]">
              <Image
                src="/images/customer-service/wearing-tips.avif"
                alt={content.tipsImageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>

            {/* Right Column - Crystal Wearing Tips (full list) */}
            <div className="flex items-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-20">
              <div className="w-full max-w-xl mx-auto space-y-6">
                <Typography variant="h3" className="text-gray-900">
                  {content.tipsTitle}
                </Typography>

                <div className="border-t border-gray-200">
                  {content.tips.map((tip) => (
                    <AccordionItem key={tip.heading} title={tip.heading} body={tip.body} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Warranty Conditions Section */}
        <section className="bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left Column - Warranty Conditions */}
            <div className="flex items-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-20">
              <div className="w-full max-w-xl mx-auto space-y-6">
                <Typography variant="h3" className="text-gray-900">
                  {content.warrantyTitle}
                </Typography>

                <div className="border-t border-gray-200">
                  {content.warrantyItems.map((item) => (
                    <AccordionItem key={item.heading} title={item.heading} body={item.body} />
                  ))}
                </div>
              </div>
            </div>

            {/* Left Column - Full Image */}
            <div className="relative h-[350px] sm:h-[420px] lg:h-auto lg:min-h-[560px]">
              <Image
                src="/images/customer-service/warranty.avif"
                alt={content.tipsImageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>

            
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-[#edf0ef] py-20 lg:py-28 border border-gray-100">
          <Container>
            <div className="max-w-6xl mx-auto space-y-10">
              <Typography variant="h3" align="center" className="text-gray-900">
                {content.faqTitle}
              </Typography>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-0">
                {[content.faqCategories.slice(0, 2), content.faqCategories.slice(2)].map(
                  (column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className={`space-y-8 ${
                        columnIndex === 0
                          ? 'lg:border-r lg:border-gray-200 lg:pr-16'
                          : 'lg:pl-16'
                      }`}
                    >
                      {column.map((category) => (
                        <div key={category.title} className="space-y-2">
                          <Typography
                            variant="body"
                            className="font-semibold uppercase tracking-wide text-gray-900"
                          >
                            {category.title}
                          </Typography>
                          <div className="border-t border-gray-200">
                            {category.items.map((item) => (
                              <AccordionItem
                                key={item.question}
                                title={item.question}
                                body={item.answer}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </Container>
        </section>



        {/* Content Section with Video Background */}
        <section className="relative overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
              ref={(el) => {
                if (el) el.playbackRate = 0.5
              }}
            >
              <source src="/videos/main.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay with blur for better text visibility */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:min-h-[560px]">
            {/* Left Column - Contact Information */}
            <div className="flex items-center px-4 py-16 sm:px-6 md:px-8 lg:px-12 lg:py-20">
              <div className="w-full max-w-xl mx-auto space-y-8 text-white">
                <Typography
                  variant="h2"
                  className="text-4xl lg:text-5xl font-bold text-white mb-8"
                  textShadow
                >
                  {content.contactTitle}
                </Typography>

                <div className="space-y-6">
                  <Typography
                    variant="body"
                    className="text-lg text-white leading-relaxed"
                    textShadow
                  >
                    <strong className="text-xl">{content.addressLabel}</strong>
                    <br />
                    {content.address.split('\n').map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </Typography>

                  <Typography
                    variant="body"
                    className="text-lg text-white leading-relaxed"
                    textShadow
                  >
                    <strong className="text-xl">{content.phoneLabel}</strong>
                    <br />
                    {content.phone}
                  </Typography>

                  <Typography
                    variant="body"
                    className="text-lg text-white leading-relaxed"
                    textShadow
                  >
                    <strong className="text-xl">{content.emailLabel}</strong>
                    <br />
                    {content.email}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Right Column - Google Map (full bleed) */}
            <div className="h-[350px] sm:h-[420px] lg:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3748572961017!2d98.36954087681498!3d7.960157404799574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3050319897c16891%3A0xa4645b8f928c3fec!2z4Lij4LmJ4Lit4Lii4Lir4Li04LiZIFN0b25lICYgQnJhY2VsZXQgOiBSb2loaW4gU3RvbmUgJiBCcmFjZWxldCA6INCa0YDQuNGB0YLQsNC70Lsg0Lgg0Y7QstC10LvQuNGA0L3Ri9C1INC40LfQtNC10LvQuNGP!5e0!3m2!1sen!2sth!4v1784364959271!5m2!1sen!2sth"
                title={content.mapTitle}
                className="block w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </section>

        

      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </>
  )
}
