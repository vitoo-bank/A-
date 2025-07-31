"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"

interface User {
  id: string
  email: string
  password?: string
  role: string
  selectedElement?: string
  rank?: string
  createdAt: string
  lastExtraAccessTimestamp?: number
  extraAccessedElementId?: string
}

interface Rank {
  id: string
  name: string
  description: string
  order: number
}

export default function RanksPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [ranks, setRanks] = useState<Rank[]>([
    { id: "water", name: "آب", description: "رنک آب", order: 1 },
    { id: "fire", name: "آتش", description: "رنک آتش", order: 2 },
    { id: "earth", name: "خاک", description: "رنک خاک", order: 3 },
    { id: "wind", name: "باد", description: "رنک باد", order: 4 },
  ])
  const [users, setUsers] = useState<User[]>([])
  const [editingRank, setEditingRank] = useState<Rank | null>(null)
  const [editingUserRank, setEditingUserRank] = useState<User | null>(null)

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

  const updateRank = () => {
    if (editingRank) {
      const updatedRanks = ranks.map((r) => (r.id === editingRank.id ? editingRank : r))
      setRanks(updatedRanks)
      setEditingRank(null)
    }
  }

  const assignUserRank = (userId: string, newRankName: string) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, rank: newRankName } : user))
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setEditingUserRank(null)
  }

  if (!isAdmin) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">مدیریت رنک‌ها</h1>
          <Button
            onClick={() => router.push("/")}
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transition-all duration-300"
          >
            بازگشت به صفحه اصلی
          </Button>
        </div>

        <Card className="bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/20 mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">رنک‌های موجود</CardTitle>
            <CardDescription className="text-muted-foreground">رنک‌ها بر اساس عناصر اصلی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ranks.map((rank) => (
                <div key={rank.id} className="relative group">
                  <Card className="bg-card/30 border-border hover:border-primary/50 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-bold text-white">{rank.name}</h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            onClick={() => setEditingRank(rank)}
                            className="bg-blue-600 hover:bg-blue-700 p-1 h-auto shadow-md"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-purple-200 text-sm">{rank.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/20 mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">اختصاص رنک به کاربران</CardTitle>
            <CardDescription className="text-muted-foreground">لیست کاربران و رنک‌های فعلی آن‌ها</CardDescription>
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
                    <div className="text-muted-foreground text-sm">رنک فعلی: {user.rank || "بدون رنک"}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setEditingUserRank(user)}
                    className="bg-blue-600 hover:bg-blue-700 shadow-md"
                  >
                    <Edit className="w-4 h-4" /> تغییر رنک
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {editingRank && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl">ویرایش رنک</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={editingRank.name}
                  onChange={(e) => setEditingRank({ ...editingRank, name: e.target.value.toUpperCase() })}
                  placeholder="نام رنک"
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                  disabled
                />
                <Input
                  value={editingRank.description}
                  onChange={(e) => setEditingRank({ ...editingRank, description: e.target.value })}
                  placeholder="توضیحات رنک"
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                />
                <div className="flex gap-2">
                  <Button onClick={updateRank} className="flex-1 bg-green-600 hover:bg-green-700 shadow-md">
                    ذخیره
                  </Button>
                  <Button
                    onClick={() => setEditingRank(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 shadow-md"
                  >
                    انصراف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {editingUserRank && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg border-border shadow-xl shadow-[var(--primary)]/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl">اختصاص رنک به {editingUserRank.email}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={editingUserRank.rank || ranks[0].name}
                  onValueChange={(value) => setEditingUserRank({ ...editingUserRank, rank: value })}
                >
                  <SelectTrigger className="bg-input/50 border-border text-foreground focus:ring-[var(--primary)] focus:border-[var(--primary)]">
                    <SelectValue placeholder="انتخاب رنک" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    {ranks.map((rank) => (
                      <SelectItem key={rank.id} value={rank.name}>
                        {rank.name} - {rank.description}
                      </SelectItem>
                    ))}
                    <SelectItem value="بدون رنک">بدون رنک</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    onClick={() => assignUserRank(editingUserRank.id, editingUserRank.rank || "")}
                    className="flex-1 bg-green-600 hover:bg-green-700 shadow-md"
                  >
                    ذخیره
                  </Button>
                  <Button
                    onClick={() => setEditingUserRank(null)}
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
