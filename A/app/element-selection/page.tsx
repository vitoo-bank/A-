"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface User {
  id: string
  email: string
  password: string
  role: string
  selectedElement?: string
  rank?: string
  createdAt: string
  lastExtraAccessTimestamp?: number
  extraAccessedElementId?: string
}

export default function ElementSelectionPage() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser: User = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (currentUser.selectedElement) {
      router.push("/")
    }
  }, [router])

  const elements = [
    { id: "water", name: "آب", icon: "💧" },
    { id: "fire", name: "آتش", icon: "🔥" },
    { id: "wind", name: "باد", icon: "💨" },
    { id: "earth", name: "خاک", icon: "🌍" },
  ]

  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId)
  }

  const handleConfirm = () => {
    if (selectedElement) {
      localStorage.setItem("selectedElement", selectedElement)

      const currentUser: User = JSON.parse(localStorage.getItem("currentUser") || "{}")
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")

      const updatedUser: User = {
        ...currentUser,
        selectedElement,
        elementLocked: true,
        rank: elements.find((e) => e.id === selectedElement)?.name,
        lastExtraAccessTimestamp: 0,
        extraAccessedElementId: "",
      }
      const updatedUsers = users.map((user: User) => (user.id === currentUser.id ? updatedUser : user))

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">انتخاب عنصر</h1>
          <p className="text-purple-200 text-lg">عنصر خود را برای شروع سفر انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {elements.map((element) => (
            <Card
              key={element.id}
              onClick={() => handleElementSelect(element.id)}
              className={cn(
                `cursor-pointer transition-all duration-300 transform hover:scale-105 group`,
                selectedElement === element.id
                  ? "bg-primary/30 border-primary shadow-lg shadow-primary/25 animate-glow"
                  : "bg-card/50 border-border hover:bg-card/70 shadow-md hover:shadow-lg",
                "backdrop-blur-md relative overflow-hidden",
                "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--primary)]/10 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 z-0",
              )}
            >
              <CardHeader className="text-center p-4 sm:p-6 relative z-10">
                <div className="text-5xl sm:text-6xl mb-2">{element.icon}</div>
                <CardTitle className="text-white text-xl sm:text-2xl">{element.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleConfirm}
            disabled={!selectedElement}
            className="px-6 py-2 sm:px-8 sm:py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-base sm:text-lg shadow-lg hover:shadow-primary/40 transition-all duration-300"
          >
            تایید انتخاب
          </Button>
        </div>
      </div>
    </div>
  )
}
