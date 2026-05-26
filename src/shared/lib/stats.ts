export type CustomerStatus = 'vip' | 'active' | 'at-risk' | 'dormant' | 'lost'

export interface Stats {
  total: number
  vip: number
  active: number
  'at-risk': number
  dormant: number
  lost: number
}

export function aggregateStats(rows: { status: string }[]): Stats {
  const stats: Stats = { total: 0, vip: 0, active: 0, 'at-risk': 0, dormant: 0, lost: 0 }
  for (const row of rows) {
    stats.total++
    const k = row.status as keyof Stats
    if (k in stats && k !== 'total') stats[k]++
  }
  return stats
}
