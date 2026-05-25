import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'عَودة | نظام تنشيط العملاء',
  description: 'منصة ذكاء اصطناعي لإعادة تفعيل قاعدة عملاء العيادات',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${inter.variable}`}>
      <body className="bg-[#FAFAF9] text-slate-900 antialiased font-sans min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: 'font-sans text-sm',
            },
          }}
        />
      </body>
    </html>
  )
}
