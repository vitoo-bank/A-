"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Trash2, Edit, X } from "lucide-react"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"

interface UserData {
  id: string
  email: string
  role: string
  selectedElement?: string
  rank?: string
  lastExtraAccessTimestamp?: number
  extraAccessedElementId?: string
}

export default function ElementPage() {
  const params = useParams()
  const router = useRouter()
  const elementId = params.id as string

  const [images, setImages] = useState<Array<{ id: string; url: string; description: string }>>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [newImage, setNewImage] = useState({ description: "", file: null as File | null })
  const [editingImage, setEditingImage] = useState<{ id: string; description: string } | null>(null)
  const [fullscreenImage, setFullscreenImage] = useState<{ url: string; description: string } | null>(null)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    const currentUser: UserData = JSON.parse(localStorage.getItem("currentUser") || "null")
    setIsAdmin(userRole === "admin")

    // Access control for regular users
    if (userRole !== "admin" && currentUser) {
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      const isPrimaryElement = currentUser.selectedElement === elementId
      const isExtraAccessedElement = currentUser.extraAccessedElementId === elementId
      const isExtraAccessValid =
        isExtraAccessedElement && now - (currentUser.lastExtraAccessTimestamp || 0) < twentyFourHours

      if (!isPrimaryElement && !isExtraAccessValid) {
        alert("شما اجازه دسترسی به این عنصر را ندارید. لطفاً از صفحه اصلی اقدام کنید یا منتظر دسترسی روزانه بمانید.")
        router.push("/")
        return
      }
    }

    // Load images for this element
    const savedImages = JSON.parse(localStorage.getItem(`images_${elementId}`) || "[]")
    setImages(savedImages)
  }, [elementId, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage({ ...newImage, file })
    }
  }

  const saveImage = () => {
    if (newImage.file && newImage.description) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImageData = {
          id: Date.now().toString(),
          url: e.target?.result as string,
          description: newImage.description,
        }
        const updatedImages = [...images, newImageData]
        setImages(updatedImages)
        localStorage.setItem(`images_${elementId}`, JSON.stringify(updatedImages))
        setNewImage({ description: "", file: null })
        setShowUpload(false)
      }
      reader.readAsDataURL(newImage.file)
    }
  }

  const deleteImage = (imageId: string) => {
    if (confirm("آیا از حذف این تصویر اطمینان دارید؟")) {
      const updatedImages = images.filter((img) => img.id !== imageId)
      setImages(updatedImages)
      localStorage.setItem(`images_${elementId}`, JSON.stringify(updatedImages))
    }
  }

  const updateImageDescription = (imageId: string, newDescription: string) => {
    const updatedImages = images.map((img) => (img.id === imageId ? { ...img, description: newDescription } : img))
    setImages(updatedImages)
    localStorage.setItem(`images_${elementId}`, JSON.stringify(updatedImages))
    setEditingImage(null)
  }

  const openFullscreen = (image: { url: string; description: string }) => {
    setFullscreenImage(image)
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
  }

  // Dummy data for element names/icons, not displayed on page but used for context
  const elementData = {
    water: { name: "آب", icon: "💧", color: "from-blue-600 to-cyan-600" },
    fire: { name: "آتش", icon: "🔥", color: "from-red-600 to-orange-600" },
    wind: { name: "باد", icon: "💨", color: "from-gray-400 to-slate-600" },
    earth: { name: "خاک", icon: "🌍", color: "from-green-600 to-emerald-600" },
    forbidden: { name: "هنر ممنوعه", icon: "🔮", color: "from-black to-red-900" },
  }

  const element = elementData[elementId as keyof typeof elementData]

  if (!element) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">عنصر یافت نشد</h1>
          <Button onClick={() => router.push("/")} className="bg-purple-600 hover:bg-purple-700">
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <Button
            onClick={() => router.push("/")}
            className="mb-4 sm:mb-6 bg-primary hover:bg-primary/90 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
          >
            ← بازگشت به صفحه اصلی
          </Button>
        </div>

        {images.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-lg border-border shadow-xl mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl sm:text-2xl">گالری تصاویر {element.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <Card
                      className="bg-card/30 border-border hover:border-primary overflow-hidden cursor-pointer"
                      onClick={() => openFullscreen(image)}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.description}
                          className="w-full h-full object-cover"
                        />
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingImage({ id: image.id, description: image.description })
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteImage(image.id)
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="text-muted-foreground text-sm">{image.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <div className="text-center mb-6 sm:mb-8">
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              {showUpload ? "لغو آپلود" : "آپلود تصویر"}
            </Button>
          </div>
        )}

        {showUpload && (
          <Card className="bg-card/50 backdrop-blur-lg border-border shadow-xl mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl sm:text-2xl">آپلود تصویر جدید</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-input/50 border-border text-foreground"
              />
              <Input
                value={newImage.description}
                onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                placeholder="توضیحات تصویر"
                className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={saveImage}
                disabled={!newImage.file || !newImage.description}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-600 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                ذخیره تصویر
              </Button>
            </CardContent>
          </Card>
        )}

        {editingImage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">ویرایش توضیحات تصویر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={editingImage.description}
                  onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                  placeholder="توضیحات جدید"
                  className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateImageDescription(editingImage.id, editingImage.description)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    ذخیره
                  </Button>
                  <Button onClick={() => setEditingImage(null)} className="flex-1 bg-gray-600 hover:bg-gray-700">
                    انصراف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={!!fullscreenImage} onOpenChange={closeFullscreen}>
          <DialogOverlay className="bg-black/80" />
          <DialogContent className="max-w-full h-full sm:max-w-4xl sm:h-auto p-0 bg-transparent border-none flex flex-col items-center justify-center">
            {fullscreenImage && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={fullscreenImage.url || "/placeholder.svg"}
                  alt={fullscreenImage.description}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
                <p className="text-white text-lg mt-4 p-2 bg-background/70 rounded-md max-w-md text-center">
                  {fullscreenImage.description}
                </p>
                <Button
                  onClick={closeFullscreen}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
                  size="icon"
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">بستن</span>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
