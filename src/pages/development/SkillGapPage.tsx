import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CareerPicker from '../../components/careers/CareerPicker'
import { careers } from '../../data/careers'
import { analyse, byName, priorityOf, statusOf, type Priority } from '../../data/skills'
import { gapsApi } from '../../services/api'

const order: Priority[] = ['Essential', 'Recommended', 'Specialization-specific', 'Optional']
interface GapResult { strengths: string[]; missing: string[]; optional: string[]; method?: string }

export default function SkillGapPage() {
  const [sp, setSp] = useSearchParams()
  const career = careers.find(c => c.id === sp.get('career')) ?? careers[0]
  const [result, setResult] = useState<GapResult>(() => analyse(career))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    gapsApi.analyse(career.id).then(data => {
      if (active && data) setResult(data as GapResult)
    }).catch(e => {
      if (active) setError(e instanceof Error ? e.message : 'Could not calculate skill gaps.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [career.id])

  const { strengths, missing, optional } = result
  const items = [...missing.map(s => ({ s, p: priorityOf(career, s) })), ...optional.map(s => ({ s, p: 'Optional' as Priority }))]
  const coverage = career.required.length ? Math.round((strengths.length / career.required.length) * 100) : 0
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Skill Gap Analysis</h1><p className="text-sm text-[#6e6e73]">Compares skills in your saved profile and evidence with this career's listed requirements.</p></div>
        <CareerPicker value={career.id} onChange={id => setSp({ career: id })} /></div>
      {loading && <p className="glass p-4 text-sm text-[#6e6e73]">Calculating your skill gaps…</p>}
      {error && <p role="alert" className="text-sm text-[#d70015]">{error}</p>}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass p-5"><p className="text-sm text-[#6e6e73]">Skill coverage</p><p className="text-3xl text-[#1d1d1f]">{coverage}%</p>
          <div className="mt-2 h-2 rounded-full bg-black/[0.05]" role="progressbar" aria-valuenow={coverage} aria-valuemin={0} aria-valuemax={100}><div className="h-2 rounded-full bg-nexus-cyan" style={{ width: `${coverage}%` }} /></div>
          <p className="mt-3 text-xs text-[#6e6e73]">{strengths.length} of {career.required.length} required skills listed</p></div>
        <section className="glass p-5 md:col-span-2"><h2 className="mb-2 font-medium text-[#1d1d1f]">Current strengths</h2>
          {strengths.length ? <div className="flex flex-wrap gap-2">{strengths.map(s => <span key={s} className="rounded-full border border-emerald-400/30 px-3 py-1 text-sm">{s} <span className="text-xs text-[#6e6e73]">· {statusOf(s)}</span></span>)}</div> : <p className="text-sm text-[#6e6e73]">No matching skills yet. Start with an Essential skill below.</p>}</section>
      </div>
      {missing.length === 0 && <p className="glass p-5">You have listed every required skill for this career. This is not an independent verification of proficiency.</p>}
      {order.map(p => { const g = items.filter(i => i.p === p); return g.length > 0 && (
        <section key={p}><h2 className="mb-2 font-medium text-[#1d1d1f]">{p}</h2>
          <div className="grid gap-3 md:grid-cols-2">{g.map(({ s }) => { const l = byName(s); const need = l?.prereqs.filter(r => !strengths.includes(r)) ?? []
            return <article key={s} className="glass p-4"><div className="flex justify-between"><h3 className="text-[#1d1d1f]">{s}</h3><span className="text-xs text-[#6e6e73]">{l?.difficulty}</span></div>
              <p className="mt-1 text-sm">{l?.desc}</p>
              <p className="mt-2 text-xs text-[#6e6e73]">Depends on: {l?.prereqs.join(', ') || 'nothing'}{need.length ? ` (not yet listed: ${need.join(', ')})` : ''}</p>
              <p className="mt-1 text-xs text-[#007AFF]">Suggested project: a small {career.title.toLowerCase()} exercise that uses {s}.</p></article> })}</div></section>) })}
      <p className="glass p-4 text-sm">Recommended learning for this career: {career.learn.join(', ')}.</p>
      <p className="text-xs text-[#6e6e73]">Method: {result.method ?? 'Compares your listed skills with the sample career requirements.'} Scores are guidance, not hiring predictions.</p>
    </div>
  )
}
