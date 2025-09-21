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
      title: 'ยืนยันรับข้อมูล',
      subtitle: 'เพิ่มเพื่อนใน LINE\n@roihin4289\nแจ้งให้ดูเพื่อยืนยันรับข้อมูล',
    },
    {
      number: 3,
      title: 'ส่งแบบ',
      subtitle: 'ส่งแบบ พร้อมคำอธิบายพลังงาน ผ่านช่องทางโลกไซต์ภายใน 2 - 4 วัน',
    },
    {
      number: 4,
      title: 'ปรับปรุงแบบ',
      subtitle: 'ลูกค้าเลือกหรือปรับแบบแบบได้ท่อนดัดสิ่นใจซื้อระงิน',
    },
    {
      number: 5,
      title: 'เตรียมกำไลหิน',
      subtitle: 'ชำระสำพลังงานหิน / ผ่านพิธีปลุกพลังหินบางคุณ ก่อนจัดส่ง',
    },
    { number: 6, title: 'จัดส่ง', subtitle: 'จัดส่งฟรีทั่วประเทศโดย EMS ไปรษณีย์ไทย' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <>
      {/* Full Width Green Header Section */}
      <section className="w-full bg-[#006039] pt-20 lg:pt-[260px]">
        <div className="py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-4 font-prompt">
              &ldquo;สั่งออกแบบกำไลหินเฉพาะบุคคล&rdquo;
            </h1>
            <p className="text-lg md:text-xl text-white font-prompt">
              เริ่มต้นด้วยการเปิดใจเพื่อให้ตัวเองได้รู้จักพลังที่มิอาจเคยได้สัมผัส
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:py-20 md:py-24 bg-white pt-0 font-prompt">
        <Container padding="lg">
          <div className="max-w-6xl mx-auto">
            {/* Steps */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {steps.map((step) => (
                <div key={step.number} className="text-center h-full">
                  <div className="bg-[#FCEFDE] rounded-lg p-4 mb-2 h-full flex flex-col">
                    <div className="text-3xl font-bold text-[#006039] mb-2">{step.number}</div>
                    <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-600 leading-tight flex-grow">{step.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Bar */}
            <div className="text-center mb-8">
              <p className="text-gray-700">
                6 ขั้นตอนเรียบง่าย แต่ปราณีตเพื่อพลังงานที่ดีที่สุด สำหรับคุณคนพิเศษ
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
                    นามสกุล (Last Name)
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
                  วัน เดือน ปี เกิด (Date of Birth)
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
                  เบอร์ติดต่อ - เพื่อตรวจอัพเดทแบบเลขศาสตร์ (Mobile No.)
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
                    งบประมาณจำกำไลหิน
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
                  ต้องการเสริมดวงและพลังงานในด้านนี้ (ระบุได้มากกว่า 1 อย่าง)
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stoneType"
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>การเงิน โชคลาภ</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stoneType"
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>การงาน ความก้าวหน้า</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stoneType"
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>ความรัก เมตตามหานิยม</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stoneType"
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>สุขภาพ กายใจ</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stoneType"
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>สมาธิ จิตวิญญาณ</span>
                  </label>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สามารถระบุรายละเอียดเรื่องที่ต้องการได้เพิ่มเติม
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
                  โปรดแจ้งชนิดหิน / โทนสีหินที่ชอบ (ถ้ามี)
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
                  รูปถ่ายปัจจุบันของเจ้าของหำไลหิน (ตรวจโหงวเองเมื่องต้น)
                </span>
              </div>

              {/* Terms */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  โปรดเลือก &ldquo;ยอมรับ&rdquo; เพื่อนใหและข้อกำหนดต่าง ๆ ดังต่อไปนี้
                </p>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mr-3 mt-1 text-[#006039] focus:ring-[#006039]"
                  />
                  <span className="text-sm text-gray-600">
                    ข้าพเจ้ารับรองความถูกต้องในข้อมูลที่ได้ระบุไว้ และยินยอมให้ร้อยหิน สโตนแอนด์
                    เบรสเลล สามารถนำข้อมูลไปใช้เพื่อการวางแบบกำไลหิน
                    การให้บริการหลังการขายรวมถึงการบริหารความสัมพันธ์เพื่อลิทธิประโยชน์กับลูกค้าของทางแบรนด์เท่านั้น
                  </span>
                </label>
              </div>

              {/* Additional Agreement */}
              <div className="mb-8">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mr-3 mt-1 text-[#006039] focus:ring-[#006039]"
                  />
                  <span className="text-sm text-gray-600">
                    ร้อยหิน สโตนแอนด์ เบรสเลล
                    ได้รักษาข้อมูลส่วนบุคคลของลูกค้าไว้เป็นความลับอย่างที่สุด
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
                  className="px-12 py-3 bg-[#D4AF37] text-white font-medium rounded-md hover:bg-[#c1a030] transition-colors"
                >
                  รีเซ็ต
                </button>
              </div>

              {/* Reference */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  โปรดเพิ่มเพื่อนใน LINE Official{' '}
                  <a href="#" className="text-[#006039] font-semibold">
                    @roihin4289
                  </a>{' '}
                  เพื่อยืนยันข้อมูลและเป็นช่องทางติดตามแบบกำไลหิน
                </p>
              </div>
            </form>

            {/* Bottom Info */}
            <div className="mt-12 space-y-4 text-sm text-gray-600">
              <h3 className="font-semibold text-base text-gray-800">งบประมาณกำไลหิน</h3>
              <p>
                งบประมาณเริ่มต้น 1,500 - 3,000 บาท
                <br />
                เลือกใช้หินคุณภาพ ความหายากอยู่ในระดับหาวัวไป มีพลังงานเรียบง่ายซัดเจน
                ให้ผลโดยตรงกับผู้ใช้ ใช้หิน 2 - 3 ชนิดในการจัดวาง
              </p>
              <p>
                งบประมาณระดับกลาง 4,000 - 6,000 บาท
                <br />
                เลือกใช้หินคุณภาพ ความหายากอยู่ในระดับกลาง มีพลังงานเรียบซับซ้อน
                ให้ผลโดยตรงและรวดเร็วกับผู้ใช้ มีความเปลี่ยนแปลงชัดเจน ใช้หิน 2 - 4 ชนิดในการจัดวาง
              </p>
              <p>
                งบประมาณระดับกลาง 8,000 - 12,000 บาท
                <br />
                เลือกใช้หินคุณภาพสูง มีเอกลักษณ์โฉพาะ ความหายากอยู่ในระดับสูง หรือมีเพียงชิ้นเดียว
                มีรูปแบบพลังงานซับซ้อน เข็มขัน ให้ผล เปลี่ยนแปลงซัดเจนรวดเร็ว มีรูปแบบแปลกตา
                รวมถึงมิวิธีใช้แบบเฉพาะทาง ใช้หิน 2 - 6 ชนิดในการจัดวาง
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
