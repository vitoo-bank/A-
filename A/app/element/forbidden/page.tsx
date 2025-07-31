"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function ForbiddenArtPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "admin") {
      router.push("/")
      return
    }
    setIsAdmin(true)
  }, [router])

  const forbiddenElements = [
    {
      id: "dark-water",
      name: "آب تاریک",
      icon: "🌊",
      color: "from-blue-950 to-purple-950",
      description:
        "جریان‌های پنهان اعماق، رازهای فراموش‌شده را زمزمه می‌کنند. قدرتی که می‌تواند همه چیز را در خود غرق کند.",
    },
    {
      id: "hellfire",
      name: "آتش دوزخی",
      icon: "🔥",
      color: "from-red-950 to-orange-950",
      description:
        "شعله‌های ابدی که از قلب تاریکی برمی‌خیزند، هر آنچه را لمس کنند به خاکستر تبدیل می‌کنند. خشم سوزان هستی.",
    },
    {
      id: "shadow-wind",
      name: "باد سایه",
      icon: "🌪️",
      color: "from-gray-950 to-zinc-950",
      description:
        "نسیم‌های نامرئی که ارواح را با خود حمل می‌کنند، زمزمه‌های گذشته را در گوش‌ها می‌نشانند. قدرت نفوذ به هر شکاف.",
    },
    {
      id: "cursed-earth",
      name: "خاک نفرین‌شده",
      icon: "⚫",
      color: "from-green-950 to-stone-950",
      description: "زمین‌های باستانی که اسرار کهن را در خود پنهان کرده‌اند، ریشه‌های قدرت‌های فراموش‌شده. بنیان هر موجودیت.",
    },
  ]

  const handleElementClick = (elementId: string) => {
    router.push(`/forbidden-element/${elementId}`)
  }

  if (!isAdmin) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-900 to-purple-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <Button
            onClick={() => router.push("/")}
            className="mb-4 sm:mb-6 bg-red-600 hover:bg-red-700 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base shadow-lg hover:shadow-red-700/40 transition-all duration-300"
          >
            ← بازگشت به صفحه اصلی
          </Button>
        </div>

        <Card className="bg-black/40 backdrop-blur-md border-red-700/50 mb-6 sm:mb-8 shadow-2xl shadow-red-800/30 animate-glow-red">
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-br from-black to-red-900 flex items-center justify-center text-5xl sm:text-6xl mb-2 sm:mb-4 border-2 border-red-600 shadow-lg shadow-red-700/40 animate-pulse-slow">
              🔮
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg shadow-red-500">
              هنر ممنوعه
            </CardTitle>
            <CardDescription className="text-red-300 text-lg">
              قدرت‌های تاریک که تنها ادمین‌ها به آن دسترسی دارند
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {forbiddenElements.map((element) => (
            <div
              key={element.id}
              onClick={() => handleElementClick(element.id)}
              className={cn(
                `relative aspect-square rounded-2xl cursor-pointer transform transition-all duration-300 group`,
                `hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${element.color}`,
                `border-2 border-red-600/60 hover:border-red-500`,
                `flex flex-col items-center justify-center text-white`,
                `shadow-lg hover:shadow-red-600/40`,
                `overflow-hidden`,
                `before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-red-900/10 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 z-0`,
              )}
            >
              <div className="text-5xl sm:text-6xl mb-2 sm:mb-4 z-10">{element.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-center px-2 sm:px-4 z-10">{element.name}</h3>
              <p className="text-sm text-red-200 text-center px-4 mt-2 z-10">{element.description}</p>
              <div className="absolute top-3 right-3 bg-red-700 text-xs px-3 py-1 rounded-full font-semibold z-10 animate-pulse">
                ممنوعه
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <div className="inline-block p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-black to-red-900 text-white border-2 border-red-500 shadow-2xl shadow-red-800/30 animate-glow-red">
            <div className="text-6xl sm:text-8xl mb-2 sm:mb-4">⚠️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-300">هشدار: استفاده از این قدرت‌ها خطرناک است</h2>
            <p className="text-red-200 mt-1 sm:mt-2 text-sm sm:text-base">
              تنها ادمین‌ها مجاز به دسترسی به این بخش هستند
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
