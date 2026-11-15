import { useState } from 'react'
import { Link } from 'react-router-dom'
import { careerDetail, careerMeta, careers } from '../../data/careers'

export default function PublicCareersPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState<string | null>(null)
  const cats = ['All', ...Array.from(new Set(careers.map(c => c.category)))]
  const list = careers.filter(c => (cat === 'All' || c.category === cat) && `${c.title} ${c.category}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <section className="mx-auto max-w-5xl px-5 pt-16">
      <h1 className="text-3xl font-semibold text-[#1d1d1f] md:text-4xl">Explore careers</h1>
      <p className="mt-2 text-[#6e6e73]">A sample of careers on AptiNexus. Create an account to see how your own skills match.</p>
      <div className="mt-6 flex flex-wrap gap-2"><input className="input w-56" placeholder="Search careers" aria-label="Search careers" value={q} onChange={e => setQ(e.target.value)} />
        {cats.map(c => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`btn-ghost !py-1.5 ${cat === c ? 'bg-[#007AFF]/10 text-[#007AFF]' : ''}`}>{c}</button>)}</div>
      {list.length === 0 && <p className="glass mt-6 p-6">No careers match “{q}”.</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">{list.map(c => (
        <article key={c.id} className="glass p-5"><p className="text-xs text-[#6e6e73]">{c.category}</p><h2 className="font-medium text-[#1d1d1f]">{c.title}</h2><p className="mt-2 text-sm">{careerDetail[c.id].overview}</p>
          <button className="mt-3 text-sm text-[#007AFF]" aria-expanded={open === c.id} onClick={() => setOpen(open === c.id ? null : c.id)}>{open === c.id ? 'Hide details' : 'Skills and education'}</button>
          {open === c.id && <div className="mt-2 text-sm"><p><span className="text-[#6e6e73]">Skills: </span>{c.required.join(', ')}</p><p className="mt-1"><span className="text-[#6e6e73]">Education: </span>{careerMeta[c.id].education}</p></div>}</article>))}</div>
      <Link to="/register" className="btn-primary mt-8">Find my matches</Link>
    </section>
  )
}
