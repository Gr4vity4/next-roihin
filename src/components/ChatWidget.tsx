"use client"

import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatWidget() {
  return (
    <button
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "px-6 py-3 rounded-full bg-green text-white",
        "flex items-center space-x-2",
        "shadow-lg hover:shadow-xl transition-all",
        "hover:bg-green/90 hover:scale-105"
      )}
      aria-label="Open chat"
    >
      <MessageCircle size={20} />
      <span className="font-thai font-medium">มาแช็ตกัน!</span>
    </button>
  )
}