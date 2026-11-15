// Demo data only. Nothing here is produced by a real AI or backend.
import type { DashboardData, User } from '../../types'
export const delay = <T,>(v: T, ms = 400) => new Promise<T>(r => setTimeout(() => r(v), ms))
export const mockUser: User = { id: 'demo-1', name: 'Aarav Shetty', email: 'demo@aptinexus.app', headline: 'Mechanical engineering student' }
export const mockDashboard: DashboardData = {
  profileCompletion: 72,
  skills: [
    { id: 's1', name: 'Python', category: 'Programming', level: 70, status: 'Practised' },
    { id: 's2', name: 'CAD Design', category: 'Engineering', level: 80, status: 'Demonstrated' },
    { id: 's3', name: 'Embedded C', category: 'Electronics', level: 55, status: 'Practised' },
    { id: 's4', name: 'Control Systems', category: 'Engineering', level: 40, status: 'Claimed' },
    { id: 's5', name: 'ROS', category: 'Robotics', level: 20, status: 'Claimed' },
  ],
  careers: [
    { id: 'c1', title: 'Robotics Engineer', category: 'Robotics', compatibility: 78, missing: ['ROS', 'Computer Vision'] },
    { id: 'c2', title: 'Mechatronics Engineer', category: 'Engineering', compatibility: 74, missing: ['PLC Programming'] },
    { id: 'c3', title: 'Simulation Engineer', category: 'Engineering', compatibility: 66, missing: ['FEA', 'MATLAB'] },
    { id: 'c4', title: 'Technical Product Manager', category: 'Product', compatibility: 52, missing: ['Roadmapping', 'Analytics'] },
  ],
  progress: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, i) => ({ month, skills: 4 + i * 2, demonstrated: 1 + i })),
}
