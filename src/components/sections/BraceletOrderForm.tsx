'use client'

import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { Container } from '../ui'

export default function BraceletOrderForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: {
      day: '',
      month: '',
      year: '',
    },
    email: '',
    phone: '',
    wristSize: '',
    beadSize: '',
    budget: '',
    stoneOptions: {
      birthStone: false,
      luckStone: false,
      healthStone: false,
      careerStone: false,
      loveStone: false,
    },
    specialRequests: '',
    notes: '',
    uploadFile: null as File | null,
    consent: false,
  })

  const steps = [
    {
      number: 1,
      title: 'กรอกข้อมูล',
      subtitle: 'กรอกข้อมูลส่วนตัวในขั้นตอนแรกเพื่อใช้ในการออกแบบ',
    },
    {
      number: 2,
      title: 'ยื่นยันวันข้อมูล',
      subtitle: 'เดือนที่เกิด / วันที่เกิดหรือใช้เวลาเกิดในกรณีที่ขอใส่อย่างละเอียด',
    },
    {
      number: 3,
      title: 'ส่งแบบ',
      subtitle: 'ส่งแบบ พร้อมกับข้อมูลเพื่อการตรวจสอบในขั้นตอนแรกถัดไปในอีก 1-2 วัน',
    },
    {
      number: 4,
      title: 'ปรับปรุงแบบ',
      subtitle: 'ลูกค้าจับการทำอีกครั้งหนึ่งหลังจากเจ้าหน้าที่ส่งแบบขั้นแรก',
    },
    {
      number: 5,
      title: 'เตรียมกำไลหิน',
      subtitle: 'ลำหินดิจิตอลเตรียม / หากผ่านกำไลหินลูกค้าเห็นชอบเห็นความเรียบร้อย',
    },
    { number: 6, title: 'จัดส่ง', subtitle: 'จัดส่งที่ผ่านขั้นตอนจาก SMS โดยมะเคียรี' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section className="pb-16 sm:py-20 md:py-24 bg-white pt-20 lg:pt-[260px] font-prompt">
      <Container padding="lg">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#006039] mb-4">
              &ldquo;สั่งออกแบบกำไลหินเฉพาะบุคคล&rdquo;
            </h1>
            <p className="text-lg text-gray-700">
              เริ่มต้นด้วยการเปิดใจเพื่อให้ตัวเองได้รู้จักพลังที่มิอาจเคยได้สัมผัส
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="bg-[#f5f3ef] rounded-lg p-4 mb-2">
                  <div className="text-3xl font-bold text-[#006039] mb-2">{step.number}</div>
                  <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-600 leading-tight">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info Bar */}
          <div className="text-center mb-8">
            <p className="text-gray-700">
              6 ขั้นตอนเรียบง่าย แต่ประกัดเพื่อพลังงานที่ดีที่สุด สำหรับคุณคนพิเศษ
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ (First Name)
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  นามสกุล (First Name)
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Birth Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วัน เดือน ปี เกิด วัน (Date of Birth)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={formData.birthDate.day}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      birthDate: { ...formData.birthDate, day: e.target.value },
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.birthDate.month}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      birthDate: { ...formData.birthDate, month: e.target.value },
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                >
                  <option value="">Month</option>
                  {[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ].map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.birthDate.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      birthDate: { ...formData.birthDate, year: e.target.value },
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ),
                  )}
                </select>
                <div className="col-span-3 flex items-center justify-end">
                  <button type="button" className="text-gray-500">
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล (E-mail Address)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                placeholder="Email Address"
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์มือถือ - เชื่อกระวอการผินลาและการแจ้ง (Mobile No.)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                placeholder="Mobile No."
              />
            </div>

            {/* Wrist and Bead Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ขนาดรอบข้อมือ (Wrist size)
                </label>
                <select
                  value={formData.wristSize}
                  onChange={(e) => setFormData({ ...formData, wristSize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                >
                  <option value="">Wrist size (cm.)</option>
                  {Array.from({ length: 10 }, (_, i) => 14 + i).map((size) => (
                    <option key={size} value={size}>
                      {size} cm.
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ขนาดเม็ดหิน (Bead size)
                </label>
                <select
                  value={formData.beadSize}
                  onChange={(e) => setFormData({ ...formData, beadSize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                >
                  <option value="">Bead size (mm.)</option>
                  {[6, 8, 10, 12].map((size) => (
                    <option key={size} value={size}>
                      {size} mm.
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  งบประมาณที่ทำได้โดย
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                >
                  <option value="">Budget</option>
                  <option value="1000-3000">1,000-3,000 บาท</option>
                  <option value="3000-5000">3,000-5,000 บาท</option>
                  <option value="5000-10000">5,000-10,000 บาท</option>
                  <option value="10000+">10,000+ บาท</option>
                </select>
              </div>
            </div>

            {/* Stone Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ต้องการหินตัวของแลผสิทชนื่น (อันเก่น 1 อย่าง)
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stoneType"
                    className="mr-3 text-[#006039] focus:ring-[#006039]"
                  />
                  <span>การชื่อ โดยสาก</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stoneType"
                    className="mr-3 text-[#006039] focus:ring-[#006039]"
                  />
                  <span>การาย ความทำหารมี</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stoneType"
                    className="mr-3 text-[#006039] focus:ring-[#006039]"
                  />
                  <span>ความที่ แล้อาชานาวีย</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stoneType"
                    className="mr-3 text-[#006039] focus:ring-[#006039]"
                  />
                  <span>อุตสาส การที่ส์</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stoneType"
                    className="mr-3 text-[#006039] focus:ring-[#006039]"
                  />
                  <span>และไร ไมลี่ยมาคม</span>
                </label>
              </div>
            </div>

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สามารถระบุลายละเอียตอื่อการได้ตกองการได้เลขาเดิม
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Notes/Instructions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ใด้ออะไรบอกทิ่ม / โทรสานีคื่อเอม (ค่ลมั)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent"
                rows={4}
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                UPLOAD
              </button>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({ ...formData, uploadFile: e.target.files[0] })
                  }
                }}
              />
              <span className="ml-4 text-sm text-gray-600">
                รูปทางหน้อรูปอบอยองล์าอท่หีน (กระวิกความดีในต์อื่อเด้ม)
              </span>
            </div>

            {/* Terms */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">
                ใม้อเงื่อต &ldquo;ชลนทื่&rdquo; หรือนัยเผาะไม่ผานมีเยายา ๅ อึองไปห์
              </p>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mr-3 mt-1 text-[#006039] focus:ring-[#006039]"
                />
                <span className="text-sm text-gray-600">
                  เข้าผากินมูลความแบอทั่งพ์งอบมแท้โรเบื่อมมี3 เมลื่อแบบไอใค้รัดเยทม สีรื่อมยอนื่
                  แองลลค ส์ามารถได์ อึองทื่ใด้เพื่อาการาวอลออกับข์หัถา การไหีถ์โอารเอมรผภาชา
                  ผลวนระแนกามารถ ของเหนื่อได็รี ถาเหนื่อ ไม่มีเอเลนท์ม รีเจพ
                  ประใส่อมรักอยที่หนาองการดแผนเอเรี่ทแก่ม
                </span>
              </label>
            </div>

            {/* Additional Agreement */}
            <div className="mb-8">
              <label className="flex items-start">
                <input type="checkbox" className="mr-3 mt-1 text-[#006039] focus:ring-[#006039]" />
                <span className="text-sm text-gray-600">
                  ยืินยี สคื่อมยอนื่ แองลลค
                  ได้ตลารบูปแผังตบมคราและองากท่าใสืืให็บีกความเอินสอทั้อัยน
                </span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                className="px-12 py-3 bg-[#006039] text-white font-medium rounded-md hover:bg-[#004d2e] transition-colors"
              >
                ส่งข้อมูล
              </button>
              <button
                type="button"
                className="px-12 py-3 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#c1a030] transition-colors"
              >
                รีเซ็ต
              </button>
            </div>

            {/* Reference */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                ไม้ออเดียพื่อป้าม LINE Official{' '}
                <a href="#" className="text-[#006039] font-semibold">
                  @roihin4289
                </a>{' '}
                เพื่อยื่นยันข้อมูลและเย็บมื่องการฟังจากบคคลทดทาไดลีถม
              </p>
            </div>
          </form>

          {/* Bottom Info */}
          <div className="mt-12 space-y-4 text-sm text-gray-600">
            <h3 className="font-semibold text-base text-gray-800">งบประมาณกำไลหิน</h3>
            <p>
              งบประมาณเจื่นเกิด 1,500 - 3,000 บาท
              <br />
              เชื่อการจื้นงอมการมาร ความพารายมูลไม้มะมนที่หิน โปตดีกวาเทือเกดทานช์กการมี
              โดียส์ลอลการที่หิน โดียม 2 - 3 ออในิการรอบาย
            </p>
            <p>
              งบประมาณตั้งกาถาช 4,000 - 6,000 บาท
              <br />
              เชื่อการจื้นงอมการมาร ความพารายมูลไม้อตีกรารา โปตดีกวาเทือนื้มตือหิน
              โดียส์ลอลการระอะรอสีหันพื์หิน โกราผแสันนแผลปลอยจย โดียม 2 - 4 อื่นบิการกอบาย
            </p>
            <p>
              งบประมาณตั้งกาถาช 8,000 - 12,000 บาท
              <br />
              เชื่อการจื้นงอมาลออกมี ปองกรีเปอนกลสา ความพารายมูลไหก็มผทิุการ หรือเด้เมแืพื่อเตียหิน
              ปรูไผแลพื้อาระเอื่อเรื่อม เจิบ เจิ โดียม หแลจื่อมการออมราอมผนื้อ ปรูงออมลอเผลรา
              ระามเรื่องการีโด้แองงการา ปาท โดียม 2 - 6 อื่นบิการกอบาย
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
