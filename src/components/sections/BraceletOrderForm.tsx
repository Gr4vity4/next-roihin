'use client'

import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { Container } from '../ui'
import Modal from '../ui/Modal'

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
    consent2: false,
  })

  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

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

  const validateForm = () => {
    const errors: string[] = []
    const fields: Record<string, boolean> = {}

    // Check First Name
    if (!formData.firstName.trim()) {
      errors.push('กรุณากรอกชื่อ (First Name)')
      fields.firstName = true
    }

    // Check Last Name
    if (!formData.lastName.trim()) {
      errors.push('กรุณากรอกนามสกุล (Last Name)')
      fields.lastName = true
    }

    // Check Date of Birth
    if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) {
      errors.push('กรุณาเลือกวัน เดือน ปี เกิด (Date of Birth)')
      fields.birthDate = true
    }

    // Check Email
    if (!formData.email.trim()) {
      errors.push('กรุณากรอกอีเมล (E-mail Address)')
      fields.email = true
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.push('กรุณากรอกอีเมลให้ถูกต้อง (Invalid E-mail format)')
        fields.email = true
      }
    }

    // Check Phone
    if (!formData.phone.trim()) {
      errors.push('กรุณากรอกเบอร์ติดต่อ (Mobile No.)')
      fields.phone = true
    }

    // Check Wrist Size
    if (!formData.wristSize) {
      errors.push('กรุณาเลือกขนาดรอบข้อมือ (Wrist size)')
      fields.wristSize = true
    }

    // Check Bead Size
    if (!formData.beadSize) {
      errors.push('กรุณาเลือกขนาดเม็ดหิน (Bead size)')
      fields.beadSize = true
    }

    // Check Budget
    if (!formData.budget) {
      errors.push('กรุณาเลือกงบประมาณ (Budget)')
      fields.budget = true
    }

    // Check at least one stone option is selected
    const hasStoneSelected = Object.values(formData.stoneOptions).some(value => value === true)
    if (!hasStoneSelected) {
      errors.push('กรุณาเลือกอย่างน้อย 1 ด้านที่ต้องการเสริมดวงและพลังงาน')
      fields.stoneOptions = true
    }

    // Check both consent checkboxes
    if (!formData.consent) {
      errors.push('กรุณายอมรับข้อกำหนดการใช้ข้อมูลส่วนบุคคล (ข้อที่ 1)')
      fields.consent = true
    }

    if (!formData.consent2) {
      errors.push('กรุณายอมรับข้อกำหนดการรักษาความลับ (ข้อที่ 2)')
      fields.consent2 = true
    }

    setValidationErrors(errors)
    setFieldErrors(fields)

    return errors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('Form submitted:', formData)
      // TODO: Submit form to API
      // For now, just log the data
      alert('ส่งข้อมูลเรียบร้อยแล้ว')
    } else {
      setShowValidationModal(true)
    }
  }

  const handleReset = () => {
    setFormData({
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
      uploadFile: null,
      consent: false,
      consent2: false,
    })
    setValidationErrors([])
    setFieldErrors({})
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
                    ชื่อ (First Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value })
                      if (fieldErrors.firstName) {
                        setFieldErrors({ ...fieldErrors, firstName: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    นามสกุล (Last Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value })
                      if (fieldErrors.lastName) {
                        setFieldErrors({ ...fieldErrors, lastName: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วัน เดือน ปี เกิด (Date of Birth) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={formData.birthDate.day}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        birthDate: { ...formData.birthDate, day: e.target.value },
                      })
                      if (fieldErrors.birthDate) {
                        setFieldErrors({ ...fieldErrors, birthDate: false })
                      }
                    }}
                    className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        birthDate: { ...formData.birthDate, month: e.target.value },
                      })
                      if (fieldErrors.birthDate) {
                        setFieldErrors({ ...fieldErrors, birthDate: false })
                      }
                    }}
                    className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        birthDate: { ...formData.birthDate, year: e.target.value },
                      })
                      if (fieldErrors.birthDate) {
                        setFieldErrors({ ...fieldErrors, birthDate: false })
                      }
                    }}
                    className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                  อีเมล (E-mail Address) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: false })
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Email Address"
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์ติดต่อ - เพื่อตรวจอัพเดทแบบเลขศาสตร์ (Mobile No.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    if (fieldErrors.phone) {
                      setFieldErrors({ ...fieldErrors, phone: false })
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                    fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mobile No."
                />
              </div>

              {/* Wrist and Bead Size */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ขนาดรอบข้อมือ (Wrist size) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.wristSize}
                    onChange={(e) => {
                      setFormData({ ...formData, wristSize: e.target.value })
                      if (fieldErrors.wristSize) {
                        setFieldErrors({ ...fieldErrors, wristSize: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.wristSize ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                    ขนาดเม็ดหิน (Bead size) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.beadSize}
                    onChange={(e) => {
                      setFormData({ ...formData, beadSize: e.target.value })
                      if (fieldErrors.beadSize) {
                        setFieldErrors({ ...fieldErrors, beadSize: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.beadSize ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                    งบประมาณจำกำไลหิน <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => {
                      setFormData({ ...formData, budget: e.target.value })
                      if (fieldErrors.budget) {
                        setFieldErrors({ ...fieldErrors, budget: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#006039] focus:border-transparent ${
                      fieldErrors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                  ต้องการเสริมดวงและพลังงานในด้านนี้ (ระบุได้มากกว่า 1 อย่าง) <span className="text-red-500">*</span>
                </label>
                <div className={`space-y-2 ${fieldErrors.stoneOptions ? 'p-2 border border-red-500 rounded-md' : ''}` }>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.stoneOptions.birthStone}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          stoneOptions: { ...formData.stoneOptions, birthStone: e.target.checked },
                        })
                        if (fieldErrors.stoneOptions) {
                          setFieldErrors({ ...fieldErrors, stoneOptions: false })
                        }
                      }}
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>การเงิน โชคลาภ</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.stoneOptions.careerStone}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          stoneOptions: { ...formData.stoneOptions, careerStone: e.target.checked },
                        })
                        if (fieldErrors.stoneOptions) {
                          setFieldErrors({ ...fieldErrors, stoneOptions: false })
                        }
                      }}
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>การงาน ความก้าวหน้า</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.stoneOptions.loveStone}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          stoneOptions: { ...formData.stoneOptions, loveStone: e.target.checked },
                        })
                        if (fieldErrors.stoneOptions) {
                          setFieldErrors({ ...fieldErrors, stoneOptions: false })
                        }
                      }}
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>ความรัก เมตตามหานิยม</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.stoneOptions.healthStone}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          stoneOptions: { ...formData.stoneOptions, healthStone: e.target.checked },
                        })
                        if (fieldErrors.stoneOptions) {
                          setFieldErrors({ ...fieldErrors, stoneOptions: false })
                        }
                      }}
                      className="mr-3 text-[#006039] focus:ring-[#006039]"
                    />
                    <span>สุขภาพ กายใจ</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.stoneOptions.luckStone}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          stoneOptions: { ...formData.stoneOptions, luckStone: e.target.checked },
                        })
                        if (fieldErrors.stoneOptions) {
                          setFieldErrors({ ...fieldErrors, stoneOptions: false })
                        }
                      }}
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
                  โปรดเลือก &ldquo;ยอมรับ&rdquo; เพื่อนใหและข้อกำหนดต่าง ๆ ดังต่อไปนี้ <span className="text-red-500">*</span>
                </p>
                <label className={`flex items-start ${fieldErrors.consent ? 'p-2 border border-red-500 rounded-md' : ''}` }>
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => {
                      setFormData({ ...formData, consent: e.target.checked })
                      if (fieldErrors.consent) {
                        setFieldErrors({ ...fieldErrors, consent: false })
                      }
                    }}
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
                <label className={`flex items-start ${fieldErrors.consent2 ? 'p-2 border border-red-500 rounded-md' : ''}` }>
                  <input
                    type="checkbox"
                    checked={formData.consent2}
                    onChange={(e) => {
                      setFormData({ ...formData, consent2: e.target.checked })
                      if (fieldErrors.consent2) {
                        setFieldErrors({ ...fieldErrors, consent2: false })
                      }
                    }}
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
                  onClick={handleReset}
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

      {/* Validation Modal */}
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title="กรุณากรอกข้อมูลให้ครบถ้วน"
        size="md"
      >
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            กรุณาตรวจสอบและกรอกข้อมูลต่อไปนี้ให้ครบถ้วน:
          </p>
          <ul className="space-y-1 text-sm text-red-600 list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowValidationModal(false)}
              className="px-6 py-2 bg-[#006039] text-white font-medium rounded-md hover:bg-[#004d2e] transition-colors"
            >
              ตกลง
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
