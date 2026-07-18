'use client'

import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Container } from '../ui'
import Modal from '../ui/Modal'
import PhoneInput from '../ui/PhoneInput'

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
    : [
        {
          number: 1,
          title: 'Fill in Your Details',
          subtitle: 'Provide your personal information in the first step for the design',
        },
        {
          number: 2,
          title: 'Confirm Your Request',
          subtitle: 'Add us on LINE\n@roihin4289\nand message us to confirm we received your details',
        },
        {
          number: 3,
          title: 'Receive the Design',
          subtitle: 'We send your design with an energy description via chat within 2 - 4 days',
        },
        {
          number: 4,
          title: 'Refine the Design',
          subtitle: 'Choose or adjust the design before deciding to purchase',
        },
        {
          number: 5,
          title: 'Bracelet Preparation',
          subtitle: 'Stone energy cleansing / empowerment ritual before delivery',
        },
        {
          number: 6,
          title: 'Delivery',
          subtitle: 'Free nationwide shipping via Thailand Post EMS',
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
      errors.push(isThai ? 'กรุณากรอกชื่อ (First Name)' : 'Please enter your First Name')
      fields.firstName = true
    }

    // Check Last Name
    if (!formData.lastName.trim()) {
      errors.push(isThai ? 'กรุณากรอกนามสกุล (Last Name)' : 'Please enter your Last Name')
      fields.lastName = true
    }

    // Check Date of Birth
    if (!formData.birthDate.day || !formData.birthDate.month || !formData.birthDate.year) {
      errors.push(
        isThai ? 'กรุณาเลือกวัน เดือน ปี เกิด (Date of Birth)' : 'Please select your Date of Birth',
      )
      fields.birthDate = true
    }

    // Check Email
    if (!formData.email.trim()) {
      errors.push(isThai ? 'กรุณากรอกอีเมล (E-mail Address)' : 'Please enter your E-mail Address')
      fields.email = true
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.push(
          isThai ? 'กรุณากรอกอีเมลให้ถูกต้อง (Invalid E-mail format)' : 'Invalid E-mail format',
        )
        fields.email = true
      }
    }

    // Check Phone
    if (!formData.phone.trim()) {
      errors.push(isThai ? 'กรุณากรอกเบอร์ติดต่อ (Mobile No.)' : 'Please enter your Mobile No.')
      fields.phone = true
    }

    // Check Wrist Size
    if (!formData.wristSize) {
      errors.push(isThai ? 'กรุณาเลือกขนาดรอบข้อมือ (Wrist size)' : 'Please select your Wrist size')
      fields.wristSize = true
    }

    // Check Bead Size
    if (!formData.beadSize) {
      errors.push(isThai ? 'กรุณาเลือกขนาดเม็ดหิน (Bead size)' : 'Please select a Bead size')
      fields.beadSize = true
    }

    // Check Budget
    if (!formData.budget) {
      errors.push(isThai ? 'กรุณาเลือกงบประมาณ (Budget)' : 'Please select a Budget')
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

            {/* Info Bar */}
            <div className="text-center mb-8">
              <p className="text-gray-700">
                {isThai
                  ? '6 ขั้นตอนเรียบง่าย แต่ปราณีตเพื่อพลังงานที่ดีที่สุด สำหรับคุณคนพิเศษ'
                  : '6 simple yet meticulous steps for the best energy — made for you, someone special'}
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
                    {isThai ? 'ชื่อ (First Name)' : 'First Name'}{' '}
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
                    {isThai ? 'นามสกุล (Last Name)' : 'Last Name'}{' '}
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
                  {isThai ? 'อีเมล (E-mail Address)' : 'E-mail Address'}{' '}
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
                    ? 'เบอร์ติดต่อ - เพื่อตรวจอัพเดทแบบเลขศาสตร์ (Mobile No.)'
                    : 'Mobile No. - for numerology check and design updates'}{' '}
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
                    {isThai ? 'ขนาดรอบข้อมือ (Wrist size)' : 'Wrist size'}{' '}
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
                    {isThai ? 'ขนาดเม็ดหิน (Bead size)' : 'Bead size'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.beadSize}
                    onChange={(e) => {
                      setFormData({ ...formData, beadSize: e.target.value })
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
                    onChange={(e) => {
                      setFormData({ ...formData, budget: e.target.value })
                      if (fieldErrors.budget) {
                        setFieldErrors({ ...fieldErrors, budget: false })
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#244323] focus:border-transparent ${
                      fieldErrors.budget ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{isThai ? 'งบประมาณ' : 'Budget'}</option>
                    <option value="1000-3000">1,000-3,000 {isThai ? 'บาท' : 'THB'}</option>
                    <option value="3000-5000">3,000-5,000 {isThai ? 'บาท' : 'THB'}</option>
                    <option value="5000-10000">5,000-10,000 {isThai ? 'บาท' : 'THB'}</option>
                    <option value="10000+">10,000+ {isThai ? 'บาท' : 'THB'}</option>
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
                    ? 'รูปถ่ายปัจจุบันของเจ้าของหำไลหิน (ตรวจโหงวเองเมื่องต้น)'
                    : 'A current photo of the bracelet owner (for an initial face reading)'}
                </span>
              </div>

              {/* Terms */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {isThai ? (
                    <>โปรดเลือก &ldquo;ยอมรับ&rdquo; เพื่อนใหและข้อกำหนดต่าง ๆ ดังต่อไปนี้</>
                  ) : (
                    <>Please select &ldquo;Accept&rdquo; to agree to the following terms</>
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
                      ? 'ข้าพเจ้ารับรองความถูกต้องในข้อมูลที่ได้ระบุไว้ และยินยอมให้ร้อยหิน สโตนแอนด์ เบรสเลล สามารถนำข้อมูลไปใช้เพื่อการวางแบบกำไลหิน การให้บริการหลังการขายรวมถึงการบริหารความสัมพันธ์เพื่อลิทธิประโยชน์กับลูกค้าของทางแบรนด์เท่านั้น'
                      : 'I certify that the information provided is accurate and consent to ROIHIN STONE & BRACELET using it for bracelet design, after-sales service, and customer relationship management for customer benefits within the brand only.'}
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
                      ? 'ร้อยหิน สโตนแอนด์ เบรสเลล ได้รักษาข้อมูลส่วนบุคคลของลูกค้าไว้เป็นความลับอย่างที่สุด'
                      : 'ROIHIN STONE & BRACELET keeps all customer personal information strictly confidential.'}
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
                  {isThai ? 'โปรดเพิ่มเพื่อนใน LINE Official' : 'Please add our LINE Official account'}{' '}
                  <a href="#" className="text-[#244323] font-semibold">
                    @roihin4289
                  </a>{' '}
                  {isThai
                    ? 'เพื่อยืนยันข้อมูลและเป็นช่องทางติดตามแบบกำไลหิน'
                    : 'to confirm your information and follow up on your bracelet design'}
                </p>
              </div>
            </form>

            {/* Bottom Info */}
            <div className="mt-12 space-y-4 text-sm text-gray-600">
              <h3 className="font-semibold text-base text-gray-800">
                {isThai ? 'งบประมาณกำไลหิน' : 'Bracelet Budget Guide'}
              </h3>
              {isThai ? (
                <>
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
                    ให้ผลโดยตรงและรวดเร็วกับผู้ใช้ มีความเปลี่ยนแปลงชัดเจน ใช้หิน 2 - 4
                    ชนิดในการจัดวาง
                  </p>
                  <p>
                    งบประมาณระดับกลาง 8,000 - 12,000 บาท
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
                    Starting budget 1,500 - 3,000 THB
                    <br />
                    Quality stones that are relatively easy to source, with simple, clear energy
                    that works directly on the wearer. Uses 2 - 3 stone types in the arrangement.
                  </p>
                  <p>
                    Mid-range budget 4,000 - 6,000 THB
                    <br />
                    Quality stones of medium rarity, with more complex energy that works directly
                    and quickly on the wearer, bringing noticeable change. Uses 2 - 4 stone types
                    in the arrangement.
                  </p>
                  <p>
                    Premium budget 8,000 - 12,000 THB
                    <br />
                    High-quality stones with a unique character, of high rarity or one-of-a-kind.
                    Complex, intense energy patterns delivering clear, rapid change, with
                    distinctive designs and specialized usage methods. Uses 2 - 6 stone types in
                    the arrangement.
                  </p>
                </>
              )}
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
