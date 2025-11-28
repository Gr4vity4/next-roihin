'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DIYCreation } from '@/lib/types/diy-creation'
import { useLocale } from 'next-intl'
import { X } from 'lucide-react'
import Image from 'next/image'

interface DIYCreationModalProps {
  creation: DIYCreation | null
  isOpen: boolean
  onClose: () => void
}

export default function DIYCreationModal({ creation, isOpen, onClose }: DIYCreationModalProps) {
  if (!creation) return null

  const locale = (useLocale() as 'th' | 'en') ?? 'th'

  const pickLocale = (primary?: string, secondary?: string) =>
    (locale === 'th' ? primary : secondary) || (locale === 'th' ? secondary : primary) || ''

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const title = pickLocale(creation.titleTh, creation.title)
  const designerName = pickLocale(creation.designerNameTh, creation.designerName)
  const description = pickLocale(creation.descriptionTh, creation.description)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image src={creation.thumbnail} alt={creation.title} fill className="object-contain" />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-1">{locale === 'th' ? 'ออกแบบโดย' : 'Designed by'}</p>
              <p className="font-semibold text-gray-900">{designerName}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                {locale === 'th' ? 'หินที่ใช้ในการออกแบบ' : 'Stones in this design'}
              </p>
              <div className="space-y-3">
                {creation.stones.map((stone, index) => (
                  <div key={index} className="bg-gray-50 p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {pickLocale(stone.nameTh, stone.name)}
                        </p>
                        <p className="text-sm text-primary">
                          {locale === 'th' ? 'พลังงาน: ' : 'Energy: '}
                          {pickLocale(stone.energyTh, stone.energy)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">
                {locale === 'th' ? 'คำอธิบาย' : 'Description'}
              </p>
              <p className="text-gray-900">{description}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                {locale === 'th' ? 'วันที่สร้าง' : 'Created on'}
              </p>
              <p className="text-sm text-gray-900">{formatDate(creation.createdAt)}</p>
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
              {locale === 'th' ? 'สั่งทำแบบนี้' : 'Order this design'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
