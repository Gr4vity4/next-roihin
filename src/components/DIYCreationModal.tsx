'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DIYCreation } from '@/lib/types/diy-creation'
import { X } from 'lucide-react'
import Image from 'next/image'

interface DIYCreationModalProps {
  creation: DIYCreation | null
  isOpen: boolean
  onClose: () => void
}

export default function DIYCreationModal({ creation, isOpen, onClose }: DIYCreationModalProps) {
  if (!creation) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{creation.titleTh}</DialogTitle>
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
            <Image src={creation.thumbnail} alt={creation.title} fill className="object-cover" />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{creation.titleTh}</h2>
              <p className="text-sm text-gray-600">{creation.title}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-1">ออกแบบโดย</p>
              <p className="font-semibold text-gray-900">{creation.designerNameTh}</p>
              <p className="text-sm text-gray-600">{creation.designerName}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">หินที่ใช้ในการออกแบบ</p>
              <div className="space-y-3">
                {creation.stones.map((stone, index) => (
                  <div key={index} className="bg-gray-50 p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{stone.nameTh}</p>
                        <p className="text-xs text-gray-600 mb-1">{stone.name}</p>
                        <p className="text-sm text-primary">พลังงาน: {stone.energyTh}</p>
                        <p className="text-xs text-gray-600">{stone.energy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">คำอธิบาย</p>
              <p className="text-gray-900">{creation.descriptionTh}</p>
              <p className="text-sm text-gray-600 mt-1">{creation.description}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">วันที่สร้าง</p>
              <p className="text-sm text-gray-900">{formatDate(creation.createdAt)}</p>
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
              สั่งทำแบบนี้
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
