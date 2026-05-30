export interface RoiReportData {
  reportMonth: string
  clinicName: string
  current: {
    reactivatedCount: number
    revenueRecovered: number
    unreachedCount: number
    costOfInaction: number
  }
  previous: {
    reactivatedCount: number
    revenueRecovered: number
  }
  segmentBreakdown: { status: string; count: number }[]
  revenueTrend: { month: string; revenue: number; visitCount: number }[]
  topReactivated: { name: string; lastVisit: string; totalSpent: number; status: string }[]
}

export const DEMO_ROI_DATA: RoiReportData = {
  reportMonth: '2026-05',
  clinicName: 'عيادة الابتسامة',
  current: {
    reactivatedCount: 38,
    revenueRecovered: 12400,
    unreachedCount: 51,
    costOfInaction: 18700,
  },
  previous: {
    reactivatedCount: 29,
    revenueRecovered: 9200,
  },
  segmentBreakdown: [
    { status: 'active', count: 1708 },
    { status: 'dormant', count: 827 },
    { status: 'vip', count: 312 },
  ],
  revenueTrend: [
    { month: '2025-12', revenue: 6200, visitCount: 21 },
    { month: '2026-01', revenue: 7400, visitCount: 26 },
    { month: '2026-02', revenue: 6800, visitCount: 23 },
    { month: '2026-03', revenue: 8900, visitCount: 31 },
    { month: '2026-04', revenue: 9200, visitCount: 29 },
    { month: '2026-05', revenue: 12400, visitCount: 38 },
  ],
  topReactivated: [
    { name: 'فاطمة الزهراني', lastVisit: '2026-05-12', totalSpent: 1800, status: 'vip' },
    { name: 'أحمد الغامدي', lastVisit: '2026-05-18', totalSpent: 1200, status: 'active' },
    { name: 'نورة السلمي', lastVisit: '2026-05-07', totalSpent: 950, status: 'active' },
    { name: 'خالد العمري', lastVisit: '2026-05-22', totalSpent: 850, status: 'active' },
    { name: 'هنوف المطيري', lastVisit: '2026-05-03', totalSpent: 720, status: 'dormant' },
  ],
}
