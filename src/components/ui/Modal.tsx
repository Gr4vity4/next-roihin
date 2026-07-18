'use client'

import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useLocale } from 'next-intl'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = 'md',
}: ModalProps) {
  const locale = useLocale()
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <Dialog.Content
          className={`fixed left-[50%] top-[50%] z-50 w-full ${sizeClasses[size]} translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`}
          onInteractOutside={(e) => {
            if (!closeOnOverlayClick) {
              e.preventDefault()
            }
          }}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between mb-4">
              {title && (
                <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </Dialog.Title>
              )}
              {showCloseButton && (
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="ml-auto inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">{locale === 'th' ? 'ปิด' : 'Close'}</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Close>
              )}
            </div>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
