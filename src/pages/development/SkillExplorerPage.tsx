import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { careers } from '../../data/careers'
import { skillsApi } from '../../services/api'
import type { LibSkill } from '../../data/skills'

export default function SkillExplorerPage() {
  const [library, setLibrary] = useState<LibSkill[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [sel, setSel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    skillsApi.list().then(items => { if (active) setLibrary(items as LibSkill[]) })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Could not load skills.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  const cats = ['All', ...Array.from(new Set(library.map(s => s.category)))]
  const list = useMemo(() => library.filter(s => (cat === 'All' || s.category === cat) && s.name.toLowerCase().includes(q.toLowerCase())), [library, q, cat])
  const skill = sel ? library.find(s => s.name === sel) : null
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && setSel(null); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Skill Explorer</h1><p className="text-sm text-[#6e6e73]">Browse skills, their prerequisites and the careers that use them.</p></div>
      <div className="flex flex-wrap gap-2"><div className="relative"><Search size={15} className="absolute left-3 top-3 text-[#6e6e73]" /><input className="input w-56 pl-9" placeholder="Search skills" aria-label="Search skills" value={q} onChange={e => setQ(e.target.value)} /></div>
        <select className="input !w-auto" aria-label="Category" value={cat} onChange={e => setCat(e.target.value)}>{cats.map(c => <option key={c}>{c}</option>)}</select></div>
      {loading && <p className="glass p-5 text-sm text-[#6e6e73]">Loading skills…</p>}
      {error && <p role="alert" className="text-sm text-[#d70015]">{error}</p>}
      {!loading && list.length === 0 && <p className="glass p-6">No skills match “{q}”. Try a different search or category.</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map(s => (
        <button key={s.name} onClick={() => setSel(s.name)} className="glass p-4 text-left hover:bg-white/90"><div className="flex justify-between"><span className="font-medium text-[#1d1d1f]">{s.name}</span><span className="text-xs text-[#6e6e73]">{s.difficulty}</span></div>
          <p className="mt-1 text-xs text-[#6e6e73]">{s.category}</p><p className="mt-2 text-sm">{s.desc}</p></button>))}</div>
      {skill && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/25 p-4" onClick={() => setSel(null)}>
          <div role="dialog" aria-modal="true" aria-label={skill.name} className="glass max-h-[85vh] w-full max-w-md overflow-y-auto bg-white/85 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between"><h2 className="text-lg font-semibold text-[#1d1d1f]">{skill.name}</h2><button aria-label="Close" onClick={() => setSel(null)}><X size={18} /></button></div>
            <p className="mt-1 text-xs text-[#6e6e73]">{skill.category} · {skill.difficulty}</p><p className="mt-3 text-sm">{skill.desc}</p>
            <p className="mt-3 text-sm"><span className="text-[#6e6e73]">Prerequisites: </span>{skill.prereqs.join(', ') || 'None'}</p>
            <p className="mt-2 text-sm"><span className="text-[#6e6e73]">Related skills: </span>{skill.related.join(', ')}</p>
            <p className="mt-2 text-sm"><span className="text-[#6e6e73]">Careers: </span>{careers.filter(c => c.required.includes(skill.name)).map(c => c.title).join(', ') || 'None in the catalog'}</p>
          </div></div>)}
    </div>
  )
}
