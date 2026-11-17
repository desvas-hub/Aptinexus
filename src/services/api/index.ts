import { request } from './client'
import { delay, mockDashboard } from '../mock/data'
import type { DashboardData, User } from '../../types'

const post = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) })

export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/login', post({ email, password }), async () => { throw new Error('Sign-in service is unavailable.') }),
  register: (name: string, email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/register', post({ name, email, password }), async () => { throw new Error('Account creation service is unavailable.') }),
}
export const analyticsApi = {
  dashboard: () => request<DashboardData>('/analytics/dashboard', undefined, () => delay(mockDashboard, 600)),
}

// ---- Per-user data (mock: localStorage; real: REST) ----
import { userData } from './userData'
import { careers } from '../../data/careers'
import { library } from '../../data/skills'
import { resources } from '../../data/resources'
import { assessments, type Assessment } from '../../data/assessments'
import type { ProfileData } from '../../data/profile'

export const profilesApi = { get: (uid: string, init: ProfileData) => userData.get('profile', uid, init), save: (uid: string, p: ProfileData) => userData.save('profile', uid, p) }
export const roadmapApi = {
  progress: (uid: string | undefined, careerId: string) => userData.get<string[]>(`roadmap:${careerId}`, uid, []),
  totalDone: async (uid: string | undefined) => (await Promise.all(careers.map(c => userData.get<string[]>(`roadmap:${c.id}`, uid, [])))).reduce((n, l) => n + l.length, 0),
}
// ---- Catalogs (mock: bundled sample data) ----
export const careersApi = { list: () => request('/careers', undefined, async () => careers), get: (id: string) => request(`/careers/${id}`, undefined, async () => careers.find(c => c.id === id)) }
export const skillsApi = { list: () => request('/skills', undefined, async () => library) }
export const resourcesApi = { list: () => request('/resources', undefined, async () => resources) }
export const assessmentsApi = {
  list: () => request<Assessment[]>('/assessments', undefined, async () => assessments),
  submit: (id: string, answers: number[]) => request<{ assessmentId: string; score: number; total: number; percentage: number; correctAnswers: number[]; feedback: string }>(`/assessments/${id}/submit`, post({ answers }), async () => {
    const item = assessments.find(a => a.id === id)
    if (!item) throw new Error('Assessment not found')
    const correctAnswers = item.questions.map(q => q.answer ?? -1)
    const score = answers.filter((answer, index) => answer === correctAnswers[index]).length
    const total = item.questions.length
    return { assessmentId: id, score, total, percentage: total ? Math.round(100 * score / total) : 0, correctAnswers, feedback: total && score / total >= 0.75 ? 'Strong result. Add a project or demonstration to back it up.' : total && score / total >= 0.5 ? 'Partial result. Revisit the topics you missed.' : 'This skill needs more practice.' }
  }),
}
export const skillGraphApi = { get: () => request('/skillgraph', undefined, async () => ({ nodes: [], edges: [] })) }

// ---- Intelligence endpoints (mock: simple demo rules, not AI) ----
import { delay as wait } from '../mock/data'
import { estimateFor } from '../../data/careers'
import { analyse } from '../../data/skills'

export interface ResumeSuggestion { section: string; target: string | null; text: string; origin: 'explicit' | 'inferred' }
export interface ResumeAnalysis { filename: string; extractedCharacters: number; suggestions: ResumeSuggestion[]; message: string }
export const resumeApi = {
  analyse: (file: File) => {
    const body = new FormData()
    body.append('file', file)
    return request<ResumeAnalysis>('/resume/analyze', { method: 'POST', body }, async () => { throw new Error('Resume analysis is unavailable.') })
  },
}
export const matchingApi = { recommendations: (have: string[] = []) => request('/careers/matches', undefined, async () => careers.map(c => { const match = analyse(c, have); return { id: c.id, title: c.title, category: c.category, compatibility: estimateFor(c, have), matched: match.strengths, missing: match.missing } }).sort((a, b) => b.compatibility - a.compatibility)) }
export const gapsApi = { analyse: (careerId: string, have: string[] = []) => request(`/careers/${careerId}/gaps`, undefined, async () => { const c = careers.find(x => x.id === careerId); return c ? analyse(c, have) : null }) }
export const whatIfApi = { simulate: (extraSkills: string[], have: string[] = []) => request('/what-if', post({ extraSkills }), async () => careers.map(c => { const current = estimateFor(c, have); const hypothetical = estimateFor(c, [...have, ...extraSkills]); return { id: c.id, current, hypothetical, change: hypothetical - current, stillNeeded: c.required.filter(s => !have.some(h => h.toLocaleLowerCase() === s.toLocaleLowerCase()) && !extraSkills.some(h => h.toLocaleLowerCase() === s.toLocaleLowerCase())) } })) }

