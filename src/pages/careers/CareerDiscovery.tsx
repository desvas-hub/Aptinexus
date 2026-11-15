import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { careers, estimate, userSkills } from '../../data/careers'

export default function CareerDiscovery() {
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState<string | null>(null)
  const cats = ['All', ...Array.from(new Set(careers.map(c => c.category)))]
  const list = useMemo(() => careers.filter(c => cat === 'All' || c.category === cat).sort((a, b) => estimate(b) - estimate(a)), [cat])
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Career Discovery</h1>
        <p className="text-sm text-[#6e6e73]">Compatibility is a rough estimate from demo data. It is not a prediction of employment.</p></div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">{cats.map(c => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`btn-ghost !py-1.5 ${cat === c ? 'bg-[#007AFF]/10 text-[#007AFF]' : ''}`}>{c}</button>)}</div>
      {list.length === 0 && <p className="glass p-6">No careers in this category yet.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map(c => {
          const have = c.required.filter(s => userSkills.includes(s)), miss = c.required.filter(s => !userSkills.includes(s)), isOpen = open === c.id
          return (
            <article key={c.id} className="glass p-5">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-medium text-[#1d1d1f]">{c.title}</h2><p className="text-xs text-[#6e6e73]">{c.category}</p></div>
                <div className="ring-meter" style={{ '--p': estimate(c), '--c': estimate(c) >= 70 ? '#34C759' : estimate(c) >= 50 ? '#007AFF' : '#FF9F0A' } as React.CSSProperties} title="Estimated compatibility" aria-label={`Estimated compatibility about ${estimate(c)} percent`}>~{estimate(c)}%</div></div>
              <p className="mt-3 text-xs text-[#6e6e73]">Matching skills</p><p className="text-sm text-[#1d1d1f]">{have.join(', ') || 'None yet'}</p>
              <p className="mt-2 text-xs text-[#6e6e73]">Missing skills</p><p className="text-sm text-[#b25000]">{miss.join(', ') || 'None'}</p>
              <button className="btn-ghost mt-4 !py-1.5" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.id)}>{isOpen ? 'Hide details' : 'Why this career'}<ChevronDown size={14} className={isOpen ? 'rotate-180' : ''} /></button>
              <Link to={`/app/careers/${c.id}`} className="btn-primary ml-2 mt-4 !py-1.5">Explore career</Link>
              {isOpen && <div className="mt-3 space-y-2 text-sm"><p>{c.why}</p><p className="text-[#6e6e73]">To get there: <span className="text-[#3a3a3c]">{c.learn.join(', ')}</span></p></div>}
            </article>)
        })}
      </div>
    </div>
  )
}
