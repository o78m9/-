import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic, Tajawal, Inter, Fraunces } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from 'sonner'
import { headers } from 'next/headers'
import { WebVitals } from '@/components/web-vitals'
import { ThemeProvider } from '@/components/theme-provider'
import { LenisProvider } from '@/components/ui/lenis-provider'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { CommandPaletteShell } from '@/components/ui/command-palette-shell'
import { EasterEgg } from '@/components/ui/easter-egg'
import { AnalyticsProvider } from '@/components/analytics/posthog-provider'
import './globals.css'

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'optional',
  preload: true,
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'optional',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'optional',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'optional',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://awdah-ochre.vercel.app'),
  title: {
    default: 'عَودة | نظام تنشيط العملاء بالذكاء الاصطناعي',
    template: '%s | عَودة',
  },
  description:
    'منصة AI لإعادة تفعيل قاعدة عملاء العيادات. ادفع فقط من الإيراد الذي نسترجعه — بدون رسوم ثابتة في الشهر الأول.',
  keywords: ['عيادة', 'تنشيط عملاء', 'ذكاء اصطناعي', 'واتساب', 'مرضى', 'إيرادات'],
  authors: [{ name: 'Aooda' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
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
  alternates: {
    canonical: '/',
    languages: { ar: '/', en: '/en' },
  },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'عَودة',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'SAR',
        description: 'ادفع فقط من الإيراد الذي نسترجعه',
      },
      description:
        'منصة AI لإعادة تفعيل قاعدة عملاء العيادات بالسعودية. نظام ذكاء اصطناعي يكتشف المرضى الخاملين ويعيدهم.',
      inLanguage: 'ar',
      url: 'https://awdah-ochre.vercel.app',
    },
    {
      '@type': 'MedicalOrganization',
      name: 'عَودة',
      description: 'منصة AI لإعادة تفعيل مرضى العيادات',
      url: 'https://awdah-ochre.vercel.app',
      areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
      availableLanguage: [
        { '@type': 'Language', name: 'Arabic' },
        { '@type': 'Language', name: 'English' },
      ],
    },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? ''
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabic.variable} ${tajawal.variable} ${inter.variable} ${fraunces.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-cream text-ink antialiased font-sans min-h-screen dark:bg-[#0d1a16] dark:text-cream">
        <AnalyticsProvider>
          <LenisProvider>
            <CommandPaletteShell>
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
                <script
                  type="application/ld+json"
                  nonce={nonce}
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
                />
                <ScrollProgress />
                <CustomCursor />
                <EasterEgg />
                <WebVitals />
                {children}
                <Toaster
                  position="top-center"
                  richColors
                  toastOptions={{
                    classNames: {
                      toast:
                        'font-sans text-sm !bg-[#0F2E29] !border !border-[rgba(212,165,116,0.2)] !text-[#F5EFE6]',
                      title: '!text-[#F5EFE6]',
                      description: '!text-[#8A9B95]',
                      actionButton: '!bg-gold-500 !text-forest-950 !font-semibold',
                      success: '!border-sage-700',
                      error: '!border-copper',
                    },
                  }}
                />
              </ThemeProvider>
            </CommandPaletteShell>
          </LenisProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}
