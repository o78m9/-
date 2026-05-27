import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic, Inter, Fraunces } from 'next/font/google'
import { Toaster } from 'sonner'
import { WebVitals } from '@/components/web-vitals'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-arabic',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://awdah-ochre.vercel.app'),
  title: {
    default: 'عَودة | نظام تنشيط العملاء بالذكاء الاصطناعي',
    template: '%s | عَودة',
  },
  description:
    'منصة AI لإعادة تفعيل قاعدة عملاء العيادات. ادفع فقط من الإيراد الذي نسترجعه — بدون رسوم ثابتة في الشهر الأول.',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: '/',
    siteName: 'عَودة',
    title: 'أعد عملاءك المفقودين قبل ما يروحوا لعيادة ثانية',
    description: 'نموذج AI ذكي يكتشف مرضاك الخاملين ويعيدهم. ادفع نسبة فقط مما نسترجعه.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'عَودة' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عَودة | نظام تنشيط العملاء بالذكاء الاصطناعي',
    description: 'ادفع فقط من الإيراد الذي نسترجعه.',
    images: ['/og-image.svg'],
  },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabic.variable} ${inter.variable} ${fraunces.variable}`}
    >
      <body className="bg-cream text-ink antialiased font-sans min-h-screen dark:bg-[#0d1a16] dark:text-cream">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-cream focus:text-[14px]"
          >
            انتقل إلى المحتوى الرئيسي
          </a>
          <WebVitals />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{ classNames: { toast: 'font-sans text-sm' } }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
