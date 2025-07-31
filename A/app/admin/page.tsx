"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, UserCheck, Edit } from "lucide-react"

interface User {
  id: string
  email: string
  password: string
  role: string
  selectedElement?: string
  createdAt: string
  lastOnline?: string // Add this line
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "admin") {
      router.push("/")
      return
    }

    setIsAdmin(true)
    loadUsers()
  }, [router])

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(storedUsers)
  }

  const deleteUser = (userId: string) => {
    if (confirm("آیا از حذف این کاربر اطمینان دارید؟")) {
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }
  }

  const makeAdmin = (userId: string) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, role: "admin" } : user))
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setEditingUser(null)
  }

  const elementNames = {
    water: "آب",
    fire: "آتش",
    wind: "باد",
    earth: "خاک",
    all: "همه عناصر",
  }

  if (!isAdmin) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">پنل مدیریت</h1>
          <Button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300"
          >
            بازگشت به صفحه اصلی
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">آمار کلی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-2 rounded-lg bg-secondary/20">
                  <div className="text-3xl font-bold text-white">{users.length}</div>
                  <div className="text-purple-200">کل کاربران</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/20">
                  <div className="text-3xl font-bold text-white">{users.filter((u) => u.role === "admin").length}</div>
                  <div className="text-purple-200">ادمین‌ها</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/20">
                  <div className="text-3xl font-bold text-white">{users.filter((u) => u.selectedElement).length}</div>
                  <div className="text-purple-200">عنصر انتخاب شده</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/20">
                  <div className="text-3xl font-bold text-white">{users.filter((u) => !u.selectedElement).length}</div>
                  <div className="text-purple-200">بدون عنصر</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">مدیریت کاربران</CardTitle>
              <CardDescription className="text-muted-foreground">
                لیست تمام کاربران و امکان ویرایش اطلاعات آن‌ها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-card/30 rounded-lg border border-secondary/30 hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{user.email}</div>
                      <div className="text-purple-200 text-sm">
                        نقش: {user.role === "admin" ? "ادمین" : "کاربر عادی"} | عنصر:{" "}
                        {user.selectedElement
                          ? elementNames[user.selectedElement as keyof typeof elementNames]
                          : "انتخاب نشده"}
                      </div>
                      <div className="text-purple-300 text-xs">
                        تاریخ عضویت: {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                      </div>
                      {user.lastOnline && ( // Display last online time if available
                        <div className="text-purple-300 text-xs">
                          آخرین آنلاین: {new Date(user.lastOnline).toLocaleDateString("fa-IR")} در{" "}
                          {new Date(user.lastOnline).toLocaleTimeString("fa-IR")}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        className="bg-blue-600 hover:bg-blue-700 shadow-md"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.role !== "admin" && (
                        <Button
                          size="sm"
                          onClick={() => makeAdmin(user.id)}
                          className="bg-green-600 hover:bg-green-700 shadow-md"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700 shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl">ویرایش کاربر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="ایمیل"
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <Input
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  placeholder="رمز عبور"
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                >
                  <SelectTrigger className="bg-input/50 border-border text-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    <SelectItem value="user">کاربر عادی</SelectItem>
                    <SelectItem value="admin">ادمین</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={editingUser.selectedElement || ""}
                  onValueChange={(value) => setEditingUser({ ...editingUser, selectedElement: value })}
                >
                  <SelectTrigger className="bg-input/50 border-border text-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]">
                    <SelectValue placeholder="انتخاب عنصر" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    <SelectItem value="water">آب</SelectItem>
                    <SelectItem value="fire">آتش</SelectItem>
                    <SelectItem value="wind">باد</SelectItem>
                    <SelectItem value="earth">خاک</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateUser(editingUser)}
                    className="flex-1 bg-green-600 hover:bg-green-700 shadow-md"
                  >
                    ذخیره
                  </Button>
                  <Button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 shadow-md"
                  >
                    انصراف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
