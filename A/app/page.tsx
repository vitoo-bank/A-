"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoadingCube from "@/components/loading-cube"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserData {
  id: string
  email: string
  role: string
  selectedElement?: string
  rank?: string
  lastExtraAccessTimestamp?: number
  extraAccessedElementId?: string
  lastOnline?: string // Add this line
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn")
    const storedCurrentUser = JSON.parse(localStorage.getItem("currentUser") || "null")

    setTimeout(() => {
      setIsLoading(false)
      if (userLoggedIn && storedCurrentUser) {
        setIsLoggedIn(true)
        // Update lastOnline timestamp for the current user
        const now = new Date().toISOString()
        const updatedCurrentUser = { ...storedCurrentUser, lastOnline: now }
        setCurrentUser(updatedCurrentUser)

        // Also update in the global users array in localStorage
        const allUsers: UserData[] = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedAllUsers = allUsers.map((user) => (user.id === updatedCurrentUser.id ? updatedCurrentUser : user))
        localStorage.setItem("users", JSON.stringify(updatedAllUsers))
        localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser)) // Ensure currentUser in localStorage is also updated

        setIsAdmin(updatedCurrentUser.role === "admin")
      }
    }, 5000)
  }, [])

  if (isLoading) {
    return <LoadingCube />
  }

  if (!isLoggedIn || !currentUser) {
    router.push("/auth")
    return null
  }

  const elements = [
    { id: "water", name: "آب", icon: "💧", color: "from-blue-600 to-cyan-600" },
    { id: "fire", name: "آتش", icon: "🔥", color: "from-red-600 to-orange-600" },
    { id: "wind", name: "باد", icon: "💨", color: "from-gray-400 to-slate-600" },
    { id: "earth", name: "خاک", icon: "🌍", color: "from-green-600 to-emerald-600" },
  ]

  const adminElements = [
    ...elements,
    { id: "forbidden", name: "هنر ممنوعه", icon: "🔮", color: "from-black to-red-900" },
  ]

  const displayElements = isAdmin ? adminElements : elements

  const handleElementClick = (elementId: string) => {
    if (isAdmin) {
      router.push(`/element/${elementId}`)
      return
    }

    // Regular user access logic
    if (currentUser?.selectedElement === elementId) {
      router.push(`/element/${elementId}`)
    } else {
      // Check for daily extra access
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

      if (
        !currentUser?.lastExtraAccessTimestamp || // No previous extra access
        now - currentUser.lastExtraAccessTimestamp > twentyFourHours // More than 24 hours passed
      ) {
        // Allow new extra access
        if (
          confirm(
            `آیا می‌خواهید از دسترسی روزانه خود برای عنصر ${displayElements.find((e) => e.id === elementId)?.name} استفاده کنید؟`,
          )
        ) {
          const updatedUser = {
            ...currentUser,
            lastExtraAccessTimestamp: now,
            extraAccessedElementId: elementId,
          }
          setCurrentUser(updatedUser)
          localStorage.setItem("currentUser", JSON.stringify(updatedUser))

          const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]")
          const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
          localStorage.setItem("users", JSON.stringify(updatedUsers))

          router.push(`/element/${elementId}`)
        }
      } else if (currentUser.extraAccessedElementId === elementId) {
        // Already accessed this extra element today
        router.push(`/element/${elementId}`)
      } else {
        // Cannot access another extra element today
        const remainingTime = twentyFourHours - (now - currentUser.lastExtraAccessTimestamp)
        const hours = Math.floor(remainingTime / (1000 * 60 * 60))
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
        alert(
          `شما قبلاً از دسترسی روزانه خود برای عنصر ${displayElements.find((e) => e.id === currentUser.extraAccessedElementId)?.name} استفاده کرده‌اید. لطفاً ${hours} ساعت و ${minutes} دقیقه دیگر صبر کنید.`,
        )
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("selectedElement")
    localStorage.removeItem("userRole")
    localStorage.removeItem("currentUser")
    router.push("/auth")
  }

  const handleAboutUsClick = () => {
    router.push("/about")
  }

  const isElementAccessible = (elementId: string) => {
    if (isAdmin) return true
    if (currentUser?.selectedElement === elementId) return true

    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000

    // If no extra access used or 24 hours passed, any non-primary element can be chosen as the daily extra
    if (!currentUser?.lastExtraAccessTimestamp || now - currentUser.lastExtraAccessTimestamp > twentyFourHours) {
      return true // User can choose this as their daily extra
    }

    // If an extra access was used within 24 hours, only that specific extra element is accessible
    return currentUser.extraAccessedElementId === elementId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">ACOMPANY</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-purple-700/30 transition-colors duration-300"
              >
                <User className="h-6 w-6" />
                <span className="sr-only">منوی کاربر</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card/90 border-border text-foreground backdrop-blur-md shadow-lg shadow-[var(--primary)]/20"
            >
              {isAdmin && (
                <>
                  <DropdownMenuItem
                    onClick={() => router.push("/admin")}
                    className="hover:bg-accent/50 cursor-pointer transition-colors duration-200"
                  >
                    پنل مدیریت
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/ranks")}
                    className="hover:bg-accent/50 cursor-pointer transition-colors duration-200"
                  >
                    رنک‌ها
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onClick={handleAboutUsClick}
                className="hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              >
                درباره ما
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              >
                خروج از حساب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div
          className={cn(
            "grid gap-6 sm:gap-8 max-w-4xl mx-auto",
            isAdmin ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 max-w-2xl",
          )}
        >
          {displayElements.map((element) => {
            const isPrimaryElement = currentUser?.selectedElement === element.id
            const accessible = isElementAccessible(element.id)
            const isForbidden = element.id === "forbidden"

            return (
              <div
                key={element.id}
                onClick={() => handleElementClick(element.id)}
                className={cn(
                  "relative aspect-square rounded-2xl cursor-pointer transform transition-all duration-300 group",
                  "hover:scale-105 hover:shadow-2xl",
                  `bg-gradient-to-br ${element.color}`,
                  "border-2 border-[var(--border)] hover:border-[var(--primary)]",
                  "flex flex-col items-center justify-center text-white",
                  "shadow-lg hover:shadow-[var(--primary)]/40",
                  isForbidden && "border-red-500/50 hover:border-red-400 hover:shadow-red-600/40",
                  !accessible && !isAdmin && "opacity-50 cursor-not-allowed pointer-events-none",
                  "overflow-hidden", // Ensure pseudo-elements are clipped
                )}
              >
                {/* Subtle overlay for hover effect */}
                <div className="absolute inset-0 bg-foreground/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="text-5xl sm:text-6xl mb-2 sm:mb-4 z-10">{element.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-center px-2 sm:px-4 z-10">{element.name}</h3>
                {isForbidden && (
                  <div className="absolute top-3 right-3 bg-red-700 text-xs px-3 py-1 rounded-full font-semibold z-10 animate-pulse">
                    ادمین
                  </div>
                )}
                {!isPrimaryElement && !isAdmin && accessible && (
                  <div className="absolute top-3 left-3 bg-blue-700 text-xs px-3 py-1 rounded-full font-semibold z-10">
                    دسترسی روزانه
                  </div>
                )}
                {!accessible && !isAdmin && (
                  <div className="absolute top-3 left-3 bg-gray-700 text-xs px-3 py-1 rounded-full font-semibold z-10">
                    قفل شده
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
