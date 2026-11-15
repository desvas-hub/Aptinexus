import { useState } from 'react'
import { careerMeta, careers, estimate, userSkills } from '../../data/careers'
import { byName } from '../../data/skills'

const rank = { Beginner: 1, Intermediate: 2, Advanced: 3 }
// Demo rule: average difficulty of the skills you still need.
const difficulty = (miss: string[]) => { if (!miss.length) return 'None'; const a = miss.reduce((t, s) => t + rank[byName(s)?.difficulty ?? 'Intermediate'], 0) / miss.length; return a < 1.7 ? 'Lower' : a < 2.4 ? 'Moderate' : 'Higher' }

export default function CareerComparisonPage() {
  const [sel, setSel] = useState<string[]>([careers[0].id, careers[1].id])
  const toggle = (id: string) => setSel(s => (s.includes(id) ? s.filter(x => x !== id) : s.length < 3 ? [...s, id] : s))
  const cols = careers.filter(c => sel.includes(c.id))
  const rows: [string, (c: (typeof careers)[number]) => React.ReactNode][] = [
    ['Category', c => c.category],
    ['Estimated compatibility', c => <span className="text-[#007AFF]">~{estimate(c)}%</span>],
    ['Required skills', c => <ul>{c.required.map(s => <li key={s}>{userSkills.includes(s) ? '✓ you have' : '○ missing'}: {s}</li>)}</ul>],
    ['Skills matched', c => `${c.required.filter(s => userSkills.includes(s)).length} of ${c.required.length}`],
    ['Education', c => careerMeta[c.id].education],
    ['Learning difficulty', c => difficulty(c.required.filter(s => !userSkills.includes(s)))],
    ['Specializations', c => careerMeta[c.id].specs.join(', ')],
    ['Related careers', c => careerMeta[c.id].related.join(', ')],
  ]
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Career Comparison</h1><p className="text-sm text-[#6e6e73]">Compare up to three careers. Scores and difficulty are demo estimates; education notes are general samples.</p></div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose careers to compare">{careers.map(c => <button key={c.id} aria-pressed={sel.includes(c.id)} disabled={!sel.includes(c.id) && sel.length >= 3} onClick={() => toggle(c.id)} className={`btn-ghost !py-1.5 ${sel.includes(c.id) ? 'bg-[#007AFF]/10 text-[#007AFF]' : ''}`}>{c.title}</button>)}</div>
      {cols.length < 2 ? <p className="glass p-6">Select at least two careers to compare.</p> : (
        <div className="glass overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
          <thead><tr className="border-b border-black/[0.08]"><th className="p-3" /> {cols.map(c => <th key={c.id} scope="col" className="p-3 text-[#1d1d1f]">{c.title}</th>)}</tr></thead>
          <tbody>{rows.map(([label, fn]) => <tr key={label} className="border-b border-black/[0.08] align-top"><th scope="row" className="p-3 font-normal text-[#6e6e73]">{label}</th>{cols.map(c => <td key={c.id} className="p-3">{fn(c)}</td>)}</tr>)}</tbody></table></div>)}
    </div>
  )
}
