import type { DashboardData } from '../../types'

export const delay = <T,>(v: T, ms = 400) => new Promise<T>(r => setTimeout(() => r(v), ms))
export const mockDashboard: DashboardData = {
  profileCompletion: 0,
  skills: [],
  careers: [],
  progress: [],
}

