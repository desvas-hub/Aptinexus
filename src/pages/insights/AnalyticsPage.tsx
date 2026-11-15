import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../../contexts/AuthContext'
import { careers, estimate } from '../../data/careers'
import { seedProjects, statusFor, type Evidence, type Project, type Result } from '../../data/evidence'
import { library } from '../../data/skills'
import { analyticsApi, roadmapApi } from '../../services/api'
import type { ProgressPoint } from '../../types'
import { useRemote } from '../../hooks/useRemote'

const tip = { contentStyle: { background: '#ffffff', border: '1px solid rgba(0,0,0,.1)' } }
const Chart = ({ title, note, children }: { title: string; note?: string; children: React.ReactElement }) => (
  <section className="glass p-5"><h2 className="font-medium text-[#1d1d1f]">{title}</h2>{note && <p className="text-xs text-[#6e6e73]">{note}</p>}<div className="mt-3 h-52"><ResponsiveContainer>{children}</ResponsiveContainer></div></section>)

export default function AnalyticsPage() {
  const uid = useAuth().user?.id
  const [projects] = useRemote<Project[]>('projects', uid, seedProjects)
  const [ev] = useRemote<Evidence[]>('evidence', uid, [])
  const [res] = useRemote<Result[]>('results', uid, [])
  const [trend, setTrend] = useState<ProgressPoint[] | null>(null)
  useEffect(() => { analyticsApi.dashboard().then(d => setTrend(d.progress)).catch(() => setTrend([])) }, [])
  const statuses = ['Claimed', 'Practised', 'Demonstrated', 'Verified']
  const all = library.map(l => statusFor(l.name, projects, ev, res))
  const dist = statuses.map(s => ({ status: s, skills: all.filter(x => x === s).length }))
  const [roadmapDone, setRoadmapDone] = useState(0)
  useEffect(() => { roadmapApi.totalDone(uid).then(setRoadmapDone).catch(() => setRoadmapDone(0)) }, [uid])
  const stats = [['Skills tracked', all.filter(s => s !== 'Not started').length], ['Skills demonstrated', all.filter(s => s === 'Demonstrated').length], ['Projects', projects.length], ['Assessments taken', res.length], ['Roadmap tasks done', roadmapDone]]
  const wins = [...res.filter(r => r.score / r.total >= 0.7).map(r => `Scored ${r.score}/${r.total} on ${r.assessment}`), ...library.filter(l => statusFor(l.name, projects, ev, res) === 'Demonstrated').map(l => `${l.name} is now Demonstrated`)]
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Progress & Analytics</h1><p className="text-sm text-[#6e6e73]">Built from your saved projects, evidence, quiz results and roadmap ticks in this browser.</p></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{stats.map(([l, v]) => <div key={l} className="glass p-4"><p className="text-2xl text-[#1d1d1f]">{v}</p><p className="text-xs text-[#6e6e73]">{l}</p></div>)}</div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Chart title="Skills by SkillProof status"><BarChart data={dist}><CartesianGrid stroke="rgba(0,0,0,.06)" /><XAxis dataKey="status" stroke="#64748b" /><YAxis allowDecimals={false} stroke="#64748b" /><Tooltip {...tip} /><Bar dataKey="skills" fill="#007AFF" radius={4} /></BarChart></Chart>
        <Chart title="Career compatibility (estimates)"><BarChart data={careers.map(c => ({ name: c.title.split(' ')[0], score: estimate(c) }))}><CartesianGrid stroke="rgba(0,0,0,.06)" /><XAxis dataKey="name" stroke="#64748b" /><YAxis domain={[0, 100]} stroke="#64748b" /><Tooltip {...tip} /><Bar dataKey="score" fill="#5AC8FA" radius={4} /></BarChart></Chart>
        <Chart title="Assessment results (%)" note={res.length ? undefined : 'No attempts yet. Take a quiz in the Assessment Centre.'}><BarChart data={res.map((r, i) => ({ name: `${r.skill} #${i + 1}`, pct: Math.round((r.score / r.total) * 100) }))}><CartesianGrid stroke="rgba(0,0,0,.06)" /><XAxis dataKey="name" stroke="#64748b" /><YAxis domain={[0, 100]} stroke="#64748b" /><Tooltip {...tip} /><Bar dataKey="pct" fill="#AF52DE" radius={4} /></BarChart></Chart>
        <Chart title="Skill growth" note="Sample trend data. Real history needs the backend."><AreaChart data={trend ?? []}><CartesianGrid stroke="rgba(0,0,0,.06)" /><XAxis dataKey="month" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip {...tip} /><Area dataKey="skills" stroke="#007AFF" fill="#007AFF" fillOpacity={0.2} /><Area dataKey="demonstrated" stroke="#5AC8FA" fill="#5AC8FA" fillOpacity={0.15} /></AreaChart></Chart>
      </div>
      <section className="glass p-5"><h2 className="mb-2 font-medium text-[#1d1d1f]">Recent achievements</h2>{wins.length ? <ul className="space-y-1 text-sm">{wins.map(w => <li key={w}>{w}</li>)}</ul> : <p className="text-sm text-[#6e6e73]">Nothing yet. Add a project with a link or score 70% on a quiz.</p>}</section>
    </div>
  )
}
