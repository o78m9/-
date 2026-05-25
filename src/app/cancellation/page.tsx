import type { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'سياسة الإلغاء',
  description: 'سياسة إلغاء الاشتراك في منصة عَودة.',
  alternates: { canonical: '/cancellation' },
}

export default function CancellationPage() {
  return (
    <LegalLayout title="سياسة الإلغاء" lastUpdated="25 مايو 2026">
      <h2>الإلغاء بسيط</h2>
      <p>
        يمكنك إلغاء اشتراكك في عَودة في أي وقت من إعدادات حسابك ← الباقة ← إلغاء الاشتراك. لا حاجة للاتصال أو الانتظار.
      </p>

      <h2>ما يحدث عند الإلغاء</h2>
      <ul>
        <li>يستمر حسابك في العمل حتى نهاية فترة الفوترة الحالية.</li>
        <li>بعد ذلك، يتم تجميد الحساب ويمكنك تصدير بياناتك خلال 30 يوم.</li>
        <li>بعد 30 يوم، يتم حذف جميع البيانات نهائياً.</li>
      </ul>

      <h2>استرداد الرسوم</h2>
      <ul>
        <li>لا نسترد الرسوم الشهرية المدفوعة عن الفترة الحالية.</li>
        <li>بالنسبة للرسوم القائمة على الأداء (20% من المسترجع): إذا أُلغي الاشتراك، نتوقف عن إصدار فواتير جديدة فوراً.</li>
      </ul>

      <h2>استفسارات الإلغاء</h2>
      <p><a href="mailto:support@aooda.com">support@aooda.com</a></p>
    </LegalLayout>
  )
}
