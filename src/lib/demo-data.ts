export interface DemoCustomer {
  id: string
  name: string
  phone: string
  status: 'vip' | 'active' | 'at-risk' | 'dormant' | 'lost'
  last_visit: string
  total_spent: number
}

export interface ActivityItem {
  id: number
  type: 'message' | 'reply' | 'booking'
  name: string
  time: string
  text: string
  sentiment?: 'positive' | 'neutral' | 'negative'
}

export const DEMO_STATS = {
  total: 247,
  vip: 18,
  active: 89,
  'at-risk': 42,
  dormant: 63,
  lost: 35,
  revenue: 8400,
  activePercent: 36,
  recovered: 12,
  campaignsSent: 186,
}

export const DEMO_SPARKLINES = {
  total: [185, 198, 210, 218, 228, 238, 247],
  active: [62, 68, 74, 79, 83, 86, 89],
  revenue: [5200, 5900, 6400, 7100, 7500, 8000, 8400],
  atRisk: [58, 55, 51, 48, 45, 43, 42],
}

export const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    type: 'message',
    name: 'سارة أبو شعر',
    time: 'منذ 3 دقائق',
    text: 'أُرسلت رسالة إعادة تفعيل',
    sentiment: 'neutral',
  },
  {
    id: 2,
    type: 'reply',
    name: 'محمد الخطيب',
    time: 'منذ 12 دقيقة',
    text: 'رد بالإيجاب — سيحجز موعد',
    sentiment: 'positive',
  },
  {
    id: 3,
    type: 'booking',
    name: 'رنا الشيخ',
    time: 'منذ 28 دقيقة',
    text: 'حجز موعد الأربعاء 11 صباحاً',
    sentiment: 'positive',
  },
  {
    id: 4,
    type: 'message',
    name: 'خالد الرشيد',
    time: 'منذ 45 دقيقة',
    text: 'أُرسلت رسالة إعادة تفعيل',
    sentiment: 'neutral',
  },
  {
    id: 5,
    type: 'reply',
    name: 'منى الحمود',
    time: 'منذ ساعة',
    text: 'طلبت معلومات عن تقويم الأسنان',
    sentiment: 'neutral',
  },
  {
    id: 6,
    type: 'booking',
    name: 'أحمد البكري',
    time: 'منذ ساعتين',
    text: 'حجز موعد الخميس 3 مساءً',
    sentiment: 'positive',
  },
  {
    id: 7,
    type: 'message',
    name: 'هند الجابر',
    time: 'منذ 3 ساعات',
    text: 'أُرسلت رسالة إعادة تفعيل',
    sentiment: 'neutral',
  },
]

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  { id: '1', name: 'أحمد البكري', phone: '0796789012', status: 'vip', last_visit: '2025-04-18', total_spent: 2100 },
  { id: '2', name: 'سارة أبو شعر', phone: '0791234567', status: 'vip', last_visit: '2025-04-10', total_spent: 1850 },
  { id: '3', name: 'رنا الشيخ', phone: '0793456789', status: 'active', last_visit: '2025-04-20', total_spent: 580 },
  { id: '4', name: 'محمد الخطيب', phone: '0792345678', status: 'active', last_visit: '2025-04-15', total_spent: 320 },
  { id: '5', name: 'يوسف النمر', phone: '0798901234', status: 'active', last_visit: '2025-04-01', total_spent: 740 },
  { id: '6', name: 'خالد الرشيد', phone: '0794567890', status: 'at-risk', last_visit: '2024-11-05', total_spent: 1200 },
  { id: '7', name: 'منى الحمود', phone: '0795678901', status: 'dormant', last_visit: '2024-08-22', total_spent: 430 },
  { id: '8', name: 'هند الجابر', phone: '0797890123', status: 'lost', last_visit: '2024-05-11', total_spent: 150 },
  { id: '9', name: 'عمر الزيدان', phone: '0799012345', status: 'active', last_visit: '2025-03-28', total_spent: 290 },
  { id: '10', name: 'لينا عبد النور', phone: '0791112233', status: 'at-risk', last_visit: '2024-12-14', total_spent: 880 },
]
