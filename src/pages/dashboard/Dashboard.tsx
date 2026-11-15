import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { analyticsApi } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import type { DashboardData } from '../../types'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const load = () => { setError(''); analyticsApi.dashboard().then(setData).catch(() => setError('Could not load your dashboard.')) }
  useEffect(load, [])
  if (error) return <div role="alert" className="glass p-6">{error} <button className="btn-ghost ml-3" onClick={load}>Retry</button></div>
  if (!data) return <div className="glass h-64 animate-pulse" aria-busy="true" aria-label="Loading dashboard" />
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Welcome back, {user?.name.split(' ')[0]}</h1><p className="text-sm text-[#6e6e73]">Sample data. Compatibility scores are estimates, not employment predictions.</p></div>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="glass p-5"><h2 className="font-medium text-[#1d1d1f]">Profile completion</h2>
          <p className="mt-2 text-3xl text-[#1d1d1f]">{data.profileCompletion}%</p>
          <div className="mt-3 h-2 rounded-full bg-black/[0.05]" role="progressbar" aria-valuenow={data.profileCompletion} aria-valuemin={0} aria-valuemax={100}><div className="h-2 rounded-full bg-gradient-to-r from-nexus-blue to-nexus-violet" style={{ width: `${data.profileCompletion}%` }} /></div></section>
        <section className="glass p-5 lg:col-span-2"><h2 className="mb-3 font-medium text-[#1d1d1f]">Skills over time</h2>
          <div className="h-40"><ResponsiveContainer><AreaChart data={data.progress}><CartesianGrid stroke="rgba(0,0,0,.06)" /><XAxis dataKey="month" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,.1)' }} />
            <Area dataKey="skills" name="Skills" stroke="#007AFF" fill="#007AFF" fillOpacity={0.2} /><Area dataKey="demonstrated" name="Demonstrated" stroke="#5AC8FA" fill="#5AC8FA" fillOpacity={0.15} /></AreaChart></ResponsiveContainer></div></section>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass p-5"><h2 className="mb-3 font-medium text-[#1d1d1f]">Skills</h2>
          {data.skills.map(s => <div key={s.id} className="mb-3"><div className="flex justify-between text-sm"><span>{s.name}</span><span className="text-[#6e6e73]">{s.status}</span></div><div className="mt-1 h-1.5 rounded-full bg-black/[0.05]"><div className="h-1.5 rounded-full bg-nexus-cyan" style={{ width: `${s.level}%` }} /></div></div>)}</section>
        <section className="glass p-5"><h2 className="mb-3 font-medium text-[#1d1d1f]">Career matches (estimated)</h2>
          {data.careers.map(c => <div key={c.id} className="mb-3 flex items-center justify-between rounded-xl border border-black/[0.08] p-3"><div><p className="text-[#1d1d1f]">{c.title}</p><p className="text-xs text-[#6e6e73]">Missing: {c.missing.join(', ')}</p></div><span className="text-[#007AFF]">~{c.compatibility}%</span></div>)}</section>
      </div>
    </div>
  )
}
