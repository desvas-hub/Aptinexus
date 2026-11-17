import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Welcome back, {user?.name.split(' ')[0]}</h1><p className="text-sm text-[#6e6e73]">Your dashboard reflects the skills and evidence saved to your profile.</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="glass p-5"><h2 className="font-medium text-[#1d1d1f]">Profile completion</h2>
          <p className="mt-2 text-3xl text-[#1d1d1f]">{data.profileCompletion}%</p>
          <div className="mt-3 h-2 rounded-full bg-black/[0.05]" role="progressbar" aria-valuenow={data.profileCompletion} aria-valuemin={0} aria-valuemax={100}><div className="h-2 rounded-full bg-gradient-to-r from-nexus-blue to-nexus-violet" style={{ width: `${data.profileCompletion}%` }} /></div></section>
        <section className="glass p-5"><h2 className="font-medium text-[#1d1d1f]">Skills listed</h2><p className="mt-2 text-3xl text-[#1d1d1f]">{data.skills.length}</p></section>
        <section className="glass p-5"><h2 className="font-medium text-[#1d1d1f]">Skills demonstrated</h2><p className="mt-2 text-3xl text-[#1d1d1f]">{data.skills.filter(s => s.status === 'Demonstrated').length}</p></section>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass p-5">
          <h2 className="mb-3 font-medium text-[#1d1d1f]">Skills</h2>
          {data.skills.length > 0 ? data.skills.map(s => <div key={s.id} className="mb-3 flex justify-between text-sm"><span>{s.name}</span><span className="text-[#6e6e73]">{s.status}</span></div>) : (
            <div className="rounded-xl border border-dashed border-black/10 bg-white/50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-[#1d1d1f]">Your skill profile is just getting started</p>
              <p className="mt-1 text-sm text-[#6e6e73]">Add skills to see your progress and build your SkillGraph.</p>
              <Link to="/app/skills" className="btn-primary mt-4 inline-flex">Explore skills</Link>
            </div>
          )}
        </section>
        <section className="glass p-5"><h2 className="mb-3 font-medium text-[#1d1d1f]">Career skill matches</h2>
          {data.careers.length ? data.careers.map(c => <div key={c.id} className="mb-3 flex items-center justify-between rounded-xl border border-black/[0.08] p-3"><div><p className="text-[#1d1d1f]">{c.title}</p><p className="text-xs text-[#6e6e73]">Missing: {c.missing.join(', ') || 'None'}</p></div><span className="text-[#007AFF]">{c.compatibility}%</span></div>) : <p className="text-sm text-[#6e6e73]">Add skills to your profile to see career matches.</p>}</section>
      </div>
    </div>
  )
}

