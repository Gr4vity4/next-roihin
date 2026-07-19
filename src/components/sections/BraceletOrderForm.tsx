'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Container } from '../ui'
import Modal from '../ui/Modal'
import PhoneInput from '../ui/PhoneInput'

// Budget tiers per bead size, matching the "หินเฉพาะบุคคล" price guide graphic
const BUDGET_TIERS_6MM = [
  { value: '900-1500', th: 'เริ่มต้น 900 - 1,500 บาท', en: 'Beginning 900 - 1,500 THB' },
  { value: '2000-5000', th: 'กลาง 2,000 - 5,000 บาท', en: 'Mid Range 2,000 - 5,000 THB' },
  { value: '6000-8000', th: 'สูง 6,000 - 8,000 บาท', en: 'High 6,000 - 8,000 THB' },
  { value: '10000+', th: 'กำหนดเอง 10,000 บาทขึ้นไป', en: 'Custom 10,000+ THB' },
]

const BUDGET_TIERS_LARGE = [
  { value: '1500-3000', th: 'เริ่มต้น 1,500 - 3,000 บาท', en: 'Beginning 1,500 - 3,000 THB' },
  { value: '4000-6000', th: 'กลาง 4,000 - 6,000 บาท', en: 'Mid Range 4,000 - 6,000 THB' },
  { value: '8000-12000', th: 'สูง 8,000 - 12,000 บาท', en: 'High 8,000 - 12,000 THB' },
  { value: '15000+', th: 'กำหนดเอง 15,000 บาทขึ้นไป', en: 'Custom 15,000+ THB' },
]

const BUDGET_OPTIONS_BY_BEAD_SIZE: Record<string, typeof BUDGET_TIERS_6MM> = {
  '6': BUDGET_TIERS_6MM,
  '8': BUDGET_TIERS_LARGE,
  '10': BUDGET_TIERS_LARGE,
  '12': BUDGET_TIERS_LARGE,
}

export default function BraceletOrderForm() {
  const locale = useLocale()
  const isThai = locale === 'th'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: {
      day: '',
      month: '',
      year: '',
    },
    email: '',
    phoneCountry: 'th',
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

  const steps = isThai
    ? [
        {
          number: 1,
          title: 'กรอกข้อมูล',
          subtitle: 'ให้ข้อมูลเบื้องต้นสำหรับออกแบบ',
        },
        {
          number: 2,
          title: 'ยืนยันรับข้อมูล',
          subtitle: 'แอด LINE @roihin4289 แจ้ง "ยืนยันข้อมูล"',
        },
        {
          number: 3,
          title: 'ส่งแบบ',
          subtitle: 'รับแบบพร้อมคำอธิบายภายใน 5-7 วัน',
        },
        {
          number: 4,
          title: 'ปรับปรุงแบบ',
          subtitle: 'เลือก/ปรับแบบก่อนชำระเงิน',
        },
        {
          number: 5,
          title: 'เตรียมกำไลหิน',
          subtitle: 'ชำระล้างและปลุกพลังก่อนจัดส่ง',
        },
        { number: 6, title: 'จัดส่ง', subtitle: 'ฟรีทั่วประเทศ ต่างประเทศคิดตามจริง' },
      ]
    : [
        {
          number: 1,
          title: 'Fill in Your Details',
          subtitle: 'Share your personal information so we can begin your design.',
        },
        {
          number: 2,
          title: 'Confirm Your Submission',
          subtitle: 'Add us on LINE @roihin4289 and message "Confirm website info"',
        },
        {
          number: 3,
          title: 'Design Delivery',
          subtitle: 'ROIHIN sends your design with a full explanation via LINE or email within 5–7 days.',
        },
        {
          number: 4,
          title: 'Refine Your Design',
          subtitle: 'Choose or adjust your design as you like before proceeding to payment.',
        },
        {
          number: 5,
          title: 'Bracelet Preparation',
          subtitle: 'Your stones are cleansed and energized, ready before shipping.',
        },
        {
          number: 6,
          title: 'Delivery',
          subtitle: 'Free shipping nationwide; international shipping charged at actual cost.',
        },
      ]

  const monthNames = isThai
    ? [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
      ]
    : [
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
      ]

  const validateForm = () => {
    const errors: string[] = []
    const fields: Record<string, boolean> = {}

    // Check First Name
    if (!formData.firstName.trim()) {
      errors.push(isThai ? 'กรุณากรอกชื่อ' : 'Please enter your First Name')
      fields.firstName = true
    }

    // Check Last Name
    if (!formData.lastName.trim()) {
      errors.push(isThai ? 'กรุณากรอกนามสกุล' : 'Please enter your Last Name')
      fields.lastName = true
    }

    // Check Date of Birth
    if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) {
      errors.push(
        isThai ? 'กรุณาเลือกวัน เดือน ปี เกิด' : 'Please select your Date of Birth',
      )
      fields.birthDate = true
    }

    // Check Email
    if (!formData.email.trim()) {
      errors.push(isThai ? 'กรุณากรอกอีเมล' : 'Please enter your E-mail Address')
      fields.email = true
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.push(
          isThai ? 'กรุณากรอกอีเมลให้ถูกต้อง' : 'Invalid E-mail format',
        )
        fields.email = true
      }
    }

    // Check Phone
    if (!formData.phone.trim()) {
      errors.push(isThai ? 'กรุณากรอกเบอร์ติดต่อ' : 'Please enter your Mobile No.')
      fields.phone = true
    }

    // Check Wrist Size
    if (!formData.wristSize) {
      errors.push(isThai ? 'กรุณาเลือกขนาดรอบข้อมือ' : 'Please select your Wrist size')
      fields.wristSize = true
    }

    // Check Bead Size
    if (!formData.beadSize) {
      errors.push(isThai ? 'กรุณาเลือกขนาดเม็ดหิน' : 'Please select a Bead size')
      fields.beadSize = true
    }

    // Check Budget
    if (!formData.budget) {
      errors.push(isThai ? 'กรุณาเลือกงบประมาณ' : 'Please select a Budget')
      fields.budget = true
    }

    // Check at least one stone option is selected
    const hasStoneSelected = Object.values(formData.stoneOptions).some(value => value === true)
    if (!hasStoneSelected) {
      errors.push(
        isThai
          ? 'กรุณาเลือกอย่างน้อย 1 ด้านที่ต้องการเสริมดวงและพลังงาน'
          : 'Please select at least 1 area of luck and energy you want to enhance',
      )
      fields.stoneOptions = true
    }

    // Check both consent checkboxes
    if (!formData.consent) {
      errors.push(
        isThai
          ? 'กรุณายอมรับข้อกำหนดการใช้ข้อมูลส่วนบุคคล (ข้อที่ 1)'
          : 'Please accept the personal data usage terms (item 1)',
      )
      fields.consent = true
    }

    if (!formData.consent2) {
      errors.push(
        isThai
          ? 'กรุณายอมรับข้อกำหนดการรักษาความลับ (ข้อที่ 2)'
          : 'Please accept the confidentiality terms (item 2)',
      )
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
      alert(isThai ? 'ส่งข้อมูลเรียบร้อยแล้ว' : 'Your information has been submitted successfully')
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
      phoneCountry: 'th',
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
      <section className="w-full bg-[#244323] pt-20 lg:pt-[260px]">
        <div className="py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#cb9e51] mb-4 font-prompt">
              &ldquo;
              {isThai ? 'สั่งออกแบบกำไลหินเฉพาะบุคคล' : 'Order Your Personalized Stone Bracelet'}
              &rdquo;
            </h1>
            <p className="text-lg md:text-xl text-white font-prompt">
              {isThai
                ? 'เริ่มต้นด้วยการเปิดใจเพื่อให้ตัวเองได้รู้จักพลังที่มิอาจเคยได้สัมผัส'
                : 'Begin by opening your heart to discover an energy you may never have experienced'}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:py-20 md:py-24 bg-white pt-0 font-prompt">
        <Container padding="lg">
          <div className="max-w-6xl mx-auto">
            {/* Info Bar */}
            <div className="text-center mb-8">
              <p className="text-gray-700 text-lg">
                {isThai
                  ? '6 ขั้นตอนเรียบง่าย แต่ปราณีตเพื่อพลังงานที่ดีที่สุด สำหรับคุณคนพิเศษ'
                  : '6 simple yet meticulous steps for the best energy — made for you, someone special'}
              </p>
            </div>
            
            {/* Steps */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
              {steps.map((step) => (
                <div key={step.number} className="text-center h-full">
                  <div className="bg-[#FCEFDE] rounded-lg p-4 mb-2 h-full flex flex-col">
                    <div className="text-3xl font-bold text-[#244323] mb-2">{step.number}</div>
                    <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-600 leading-tight flex-grow">{step.subtitle}</p>
                  </div>
                </div>
              ))}
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
                    {isThai ? 'ชื่อ' : 'First Name'}{' '}
                    <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isThai ? 'ชื่อ' : 'First Name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isThai ? 'นามสกุล' : 'Last Name'}{' '}
                    <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isThai ? 'นามสกุล' : 'Last Name'}
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isThai ? 'วัน เดือน ปี เกิด (Date of Birth)' : 'Date of Birth'}{' '}
                  <span className="text-red-500">*</span>
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
                    className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{isThai ? 'วัน' : 'Day'}</option>
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
                    className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{isThai ? 'เดือน' : 'Month'}</option>
                    {monthNames.map((month, index) => (
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
                    className={`px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{isThai ? 'ปี' : 'Year'}</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isThai ? 'อีเมล' : 'E-mail Address'}{' '}
                  <span className="text-red-500">*</span>
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
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isThai ? 'อีเมล' : 'Email Address'}
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {isThai
                    ? 'เบอร์ติดต่อ - เพื่อตรวจพลังงานด้านเลขศาสตร์'
                    : 'Contact number – for numerological readings.'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  id="phone"
                  lang={locale}
                  country={formData.phoneCountry}
                  phone={formData.phone}
                  onCountryChange={(code) => setFormData({ ...formData, phoneCountry: code })}
                  onPhoneChange={(phone) => {
                    setFormData({ ...formData, phone })
                    if (fieldErrors.phone) {
                      setFieldErrors({ ...fieldErrors, phone: false })
                    }
                  }}
                  hasError={fieldErrors.phone}
                  placeholder={isThai ? 'เบอร์โทรศัพท์' : 'Mobile No.'}
                />
              </div>

              {/* Wrist and Bead Size */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isThai ? 'ขนาดรอบข้อมือ' : 'Wrist size'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.wristSize}
                    onChange={(e) => {
                      setFormData({ ...formData, wristSize: e.target.value })
                      if (fieldErrors.wristSize) {
                        setFieldErrors({ ...fieldErrors, wristSize: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.wristSize ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {isThai ? 'ขนาดรอบข้อมือ (ซม.)' : 'Wrist size (cm.)'}
                    </option>
                    {Array.from({ length: 10 }, (_, i) => 14 + i).map((size) => (
                      <option key={size} value={size}>
                        {size} cm.
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isThai ? 'ขนาดเม็ดหิน' : 'Bead size'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.beadSize}
                    onChange={(e) => {
                      const beadSize = e.target.value
                      const options = BUDGET_OPTIONS_BY_BEAD_SIZE[beadSize] ?? []
                      setFormData({
                        ...formData,
                        beadSize,
                        budget: options.some((o) => o.value === formData.budget)
                          ? formData.budget
                          : '',
                      })
                      if (fieldErrors.beadSize) {
                        setFieldErrors({ ...fieldErrors, beadSize: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.beadSize ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {isThai ? 'ขนาดเม็ดหิน (มม.)' : 'Bead size (mm.)'}
                    </option>
                    {[6, 8, 10, 12].map((size) => (
                      <option key={size} value={size}>
                        {size} mm.
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isThai ? 'งบประมาณจำกำไลหิน' : 'Bracelet budget'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.budget}
                    disabled={!formData.beadSize}
                    onChange={(e) => {
                      setFormData({ ...formData, budget: e.target.value })
                      if (fieldErrors.budget) {
                        setFieldErrors({ ...fieldErrors, budget: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${
                      fieldErrors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">
                      {formData.beadSize
                        ? isThai
                          ? 'งบประมาณ'
                          : 'Budget'
                        : isThai
                          ? 'เลือกขนาดเม็ดหินก่อน'
                          : 'Select bead size first'}
                    </option>
                    {(BUDGET_OPTIONS_BY_BEAD_SIZE[formData.beadSize] ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {isThai ? option.th : option.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stone Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isThai
                    ? 'ต้องการเสริมดวงและพลังงานในด้านนี้ (ระบุได้มากกว่า 1 อย่าง)'
                    : 'Areas of luck and energy you want to enhance (select one or more)'}{' '}
                  <span className="text-red-500">*</span>
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
                      className="mr-3 text-[#244323] focus:ring-[#244323]"
                    />
                    <span>{isThai ? 'การเงิน โชคลาภ' : 'Wealth & Fortune'}</span>
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
                      className="mr-3 text-[#244323] focus:ring-[#244323]"
                    />
                    <span>{isThai ? 'การงาน ความก้าวหน้า' : 'Career & Progress'}</span>
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
                      className="mr-3 text-[#244323] focus:ring-[#244323]"
                    />
                    <span>{isThai ? 'ความรัก เมตตามหานิยม' : 'Love & Charm'}</span>
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
                      className="mr-3 text-[#244323] focus:ring-[#244323]"
                    />
                    <span>{isThai ? 'สุขภาพ กายใจ' : 'Physical & Mental Health'}</span>
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
                      className="mr-3 text-[#244323] focus:ring-[#244323]"
                    />
                    <span>{isThai ? 'สมาธิ จิตวิญญาณ' : 'Meditation & Spirituality'}</span>
                  </label>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isThai
                    ? 'สามารถระบุรายละเอียดเรื่องที่ต้องการได้เพิ่มเติม'
                    : 'You can provide additional details about what you are looking for'}
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Notes/Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isThai
                    ? 'โปรดแจ้งชนิดหิน / โทนสีหินที่ชอบ (ถ้ามี)'
                    : 'Please specify preferred stone types / color tones (if any)'}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent"
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
                  {isThai ? 'อัปโหลด' : 'UPLOAD'}
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
                  {isThai
                    ? 'อัพโหลด : รูปถ่ายปัจจุบันของเจ้าของกำไลหิน (ตรวจโหงวเฮ้งเบื้องต้น)'
                    : 'Upload: A current photo of the bracelet owner (for a preliminary face-reading/physiognomy check)'}
                </span>
              </div>

              {/* Terms */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {isThai ? (
                    <>โปรดเลือก &ldquo;ยอมรับ&rdquo; เงื่อนไขและข้อกำหนดต่าง ๆ ดังต่อไปนี้</>
                  ) : (
                    <>Please select &ldquo;Accept&rdquo; for the following terms and conditions</>
                  )}{' '}
                  <span className="text-red-500">*</span>
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
                    className="mr-3 mt-1 text-[#244323] focus:ring-[#244323]"
                  />
                  <span className="text-sm text-gray-600">
                    {isThai
                      ? 'ข้าพเจ้ารับรองความถูกต้องในข้อมูลที่ได้ระบุไว้ และยินยอมให้ร้อยหิน สโตนแอนด์ เบรสเลส สามารถนำข้อมูลไปใช้เพื่อการวางแบบกำไลหิน การให้บริการหลังการขายรวมถึงการบริหารความสัมพันธ์เพื่อสิทธิประโยชน์กับลูกค้าของทางแบรนด์เท่านั้น'
                      : "I certify that the information I have provided is accurate, and I consent to Roihin Stone & Bracelet using this information to design the stone bracelet, provide after-sales service, and manage the customer relationship, solely for the benefit of the brand's customers."}
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
                    className="mr-3 mt-1 text-[#244323] focus:ring-[#244323]"
                  />
                  <span className="text-sm text-gray-600">
                    {isThai
                      ? 'ร้อยหิน สโตนแอนด์ เบรสเลส ได้รักษาข้อมูลส่วนบุคคลของลูกค้าไว้เป็นความลับอย่างที่สุด'
                      : "Roihin Stone & Bracelet will keep the customer's personal information strictly confidential."}
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  className="px-12 py-3 bg-[#244323] text-white font-medium rounded-md hover:bg-[#004d2e] transition-colors"
                >
                  {isThai ? 'ส่งข้อมูล' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-12 py-3 bg-[#cb9e51] text-white font-medium rounded-md hover:bg-[#c1a030] transition-colors"
                >
                  {isThai ? 'รีเซ็ต' : 'Reset'}
                </button>
              </div>

              {/* Reference */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  {isThai ? 'โปรดเพิ่มเพื่อนใน LINE Official' : 'Please add us as a friend on LINE Official'}{' '}
                  <a href="#" className="text-[#244323] font-semibold">
                    @roihin4289
                  </a>{' '}
                  {isThai
                    ? 'เพื่อยืนยันข้อมูลและเป็นช่องทางติดตามแบบกำไลหิน'
                    : 'to confirm your information and as a channel to follow up on your bracelet design.'}
                </p>
              </div>
            </form>

            {/* Bottom Info */}
            <div className="mt-12 space-y-4 text-sm text-gray-600">
              <h3 className="font-semibold text-base text-gray-800">
                {isThai ? 'งบประมาณกำไลหิน' : 'Budget for Bracelet-Making'}
              </h3>
              {isThai ? (
                <>
                  <p>
                    งบประมาณเริ่มต้น
                    <br />
                    เลือกใช้หินคุณภาพ ความหายากอยู่ในระดับหาวัวไป มีพลังงานเรียบง่ายซัดเจน
                    ให้ผลโดยตรงกับผู้ใช้ ใช้หิน 2 - 3 ชนิดในการจัดวาง
                  </p>
                  <p>
                    งบประมาณระดับกลาง
                    <br />
                    เลือกใช้หินคุณภาพ ความหายากอยู่ในระดับกลาง มีพลังงานเรียบซับซ้อน
                    ให้ผลโดยตรงและรวดเร็วกับผู้ใช้ มีความเปลี่ยนแปลงชัดเจน ใช้หิน 2 - 4
                    ชนิดในการจัดวาง
                  </p>
                  <p>
                    งบประมาณระดับกลาง-สูง
                    <br />
                    เลือกใช้หินคุณภาพสูง มีเอกลักษณ์โฉพาะ ความหายากอยู่ในระดับสูง
                    หรือมีเพียงชิ้นเดียว มีรูปแบบพลังงานซับซ้อน เข็มขัน ให้ผล
                    เปลี่ยนแปลงซัดเจนรวดเร็ว มีรูปแบบแปลกตา รวมถึงมิวิธีใช้แบบเฉพาะทาง ใช้หิน 2 - 6
                    ชนิดในการจัดวาง
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Starting budget
                    <br />
                    Uses quality stones with a common/standard level of rarity. The energy is simple and clear, giving results that directly match the user. Uses 2–3 types of stones in the arrangement.
                  </p>
                  <p>
                    Mid-level budget
                    <br />
                    Uses quality stones with a mid-level rarity. The energy is more intricate/layered, giving results that are direct and fast-acting for the user, with clear, noticeable changes. Uses 2–4 types of stones in the arrangement.
                  </p>
                  <p>
                    Mid-high budget
                    <br />
                    Uses high-quality stones with distinctive characteristics and a high level of rarity, or a single rare piece. Features a complex, intense energy pattern that produces clear and fast results, with unique/unusual patterns and specialized usage methods. Uses 2–6 types of stones in the arrangement.
                  </p>
                </>
              )}
            </div>

            {/* Bottom Images — columns sized to each image's aspect ratio so both render equal height */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-[1.297fr_0.852fr] gap-4 items-center">
              <Image
                src="/images/bracelet-order/773F64F6-685B-42B2-9B8B-364DDDE7A17B.avif"
                alt={isThai ? 'วิธีวัดขนาดข้อมือ' : 'How to measure your wrist size'}
                width={2048}
                height={1579}
                className="w-full h-auto rounded-lg"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <Image
                src="/images/bracelet-order/C25D5F1B-1CC6-44F9-864E-BBB865515F51.avif"
                alt={isThai ? 'ขนาดเม็ดหิน' : 'Bead size comparison'}
                width={1744}
                height={2048}
                className="w-full h-auto rounded-lg"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Validation Modal */}
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title={isThai ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please complete all required fields'}
        size="md"
      >
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            {isThai
              ? 'กรุณาตรวจสอบและกรอกข้อมูลต่อไปนี้ให้ครบถ้วน:'
              : 'Please review and complete the following fields:'}
          </p>
          <ul className="space-y-1 text-sm text-red-600 list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowValidationModal(false)}
              className="px-6 py-2 bg-[#244323] text-white font-medium rounded-md hover:bg-[#004d2e] transition-colors"
            >
              {isThai ? 'ตกลง' : 'OK'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
