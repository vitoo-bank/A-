"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  lastOnline?: string // Add this line
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("رمز عبور و تکرار آن یکسان نیستند")
      return
    }

    // Check for admin credentials
    if (formData.email === "admin@gmail.com" && formData.password === "10101010") {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("selectedElement", "all") // Admin can access all elements
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: "admin@gmail.com",
          role: "admin",
          id: "admin-001",
          rank: "ادمین", // Admin has a special rank
          lastExtraAccessTimestamp: 0, // Admins don't need this for element access
          extraAccessedElementId: "",
          lastOnline: new Date().toISOString(), // Add this line
        }),
      )
      router.push("/")
      return
    }

    // Regular user login/registration
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")

    if (isLogin) {
      // Login logic
      const user = users.find((u: User) => u.email === formData.email && u.password === formData.password)
      if (user) {
        const updatedUser = { ...user, lastOnline: new Date().toISOString() } // Update lastOnline
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userRole", updatedUser.role || "user")
        localStorage.setItem("currentUser", JSON.stringify(updatedUser)) // Save updated user
        if (updatedUser.selectedElement) {
          router.push("/")
        } else {
          router.push("/element-selection")
        }
        // Update the user in the global users array as well
        const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        localStorage.setItem("users", JSON.stringify(updatedUsers))
      } else {
        alert("اطلاعات ورود اشتباه است")
      }
    } else {
      // Registration logic
      const newUser: User = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password,
        role: "user",
        createdAt: new Date().toISOString(),
        lastExtraAccessTimestamp: 0,
        extraAccessedElementId: "",
        lastOnline: new Date().toISOString(), // Add this line
      }
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", "user")
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      router.push("/element-selection")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white drop-shadow-lg">ACOMPANY</CardTitle>
          <CardDescription className="text-muted-foreground">
            برای ورود به دنیای عناصر، وارد شوید یا ثبت نام کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? "login" : "register"} onValueChange={(value) => setIsLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 border border-border">
              <TabsTrigger
                value="login"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
              >
                ورود
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
              >
                ثبت نام
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="ایمیل"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="رمز عبور"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300"
                >
                  ورود
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder="ایمیل"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="رمز عبور"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="تکرار رمز عبور"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300"
                >
                  ثبت نام
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
