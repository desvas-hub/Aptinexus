export type SkillStatus = 'Claimed' | 'Practised' | 'Demonstrated' | 'Verified'
export interface User { id: string; name: string; email: string; headline: string }
export interface Skill { id: string; name: string; category: string; level: number; status: SkillStatus }
export interface CareerMatch { id: string; title: string; category: string; compatibility: number; missing: string[] }
export interface ProgressPoint { month: string; skills: number; demonstrated: number }
export interface DashboardData { profileCompletion: number; skills: Skill[]; careers: CareerMatch[]; progress: ProgressPoint[] }
