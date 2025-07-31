"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4",
        "bg-gradient-to-br from-[var(--background)] via-[var(--secondary)] to-[var(--primary)]",
      )}
    >
      <Card
        className={cn(
          "w-full max-w-md text-center relative overflow-hidden",
          "bg-card/70 backdrop-blur-xl border-[var(--border)] shadow-2xl",
          "shadow-[var(--primary)]/30 transition-all duration-500 hover:shadow-[var(--primary)]/50",
          "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--primary)]/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        )}
      >
        <CardHeader className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-4xl text-white shadow-lg animate-pulse-slow">
            ✨
          </div>
          <CardTitle className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">درباره ما</CardTitle>
          <CardDescription className="text-purple-200 text-lg">کاوش در قلب ACOMPANY</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10 pb-8">
          <p className="text-white text-xl leading-relaxed">
            ما در ACOMPANY متعهد به ارائه تجربه‌ای بی‌نظیر در دنیای عناصر هستیم. هدف ما ایجاد فضایی است که در آن قدرت‌های
            باستانی با فناوری مدرن در هم آمیخته‌اند.
          </p>
          <p className="text-purple-300 text-lg font-medium">
            برای هرگونه سوال، پیشنهاد یا پشتیبانی، می‌توانید با تیم ما در تماس باشید:
          </p>
          <a
            href="mailto:ACOMPANY@gmail.com"
            className="text-primary text-2xl font-bold hover:text-accent transition-colors duration-300 block"
          >
            ACOMPANY@gmail.com
          </a>
          <Button
            onClick={() => router.push("/")}
            className="mt-8 px-8 py-3 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/40"
          >
            بازگشت به صفحه اصلی
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
