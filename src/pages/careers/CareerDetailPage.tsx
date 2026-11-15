import { Link, useParams } from 'react-router-dom'
import { careerDetail, careerMeta, careers, estimate, userSkills } from '../../data/careers'
import { resources } from '../../data/resources'
import { analyse } from '../../data/skills'

const List = ({ title, items }: { title: string; items: string[] }) => <section className="glass p-5"><h2 className="mb-2 font-medium text-[#1d1d1f]">{title}</h2><ul className="list-inside list-disc space-y-1 text-sm">{items.map(i => <li key={i}>{i}</li>)}</ul></section>
export default function CareerDetailPage() {
  const c = careers.find(x => x.id === useParams().id)
  if (!c) return <div className="glass mx-auto max-w-lg p-6">That career wasn’t found. <Link className="text-[#007AFF]" to="/app/explore">Browse all careers</Link></div>
  const d = careerDetail[c.id], m = careerMeta[c.id], { optional } = analyse(c)
  const res = resources.filter(r => c.required.includes(r.skill)).slice(0, 4)
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div><p className="text-sm text-[#6e6e73]">{c.category} · estimated compatibility ~{estimate(c)}%</p><h1 className="text-2xl font-semibold text-[#1d1d1f]">{c.title}</h1><p className="mt-2">{d.overview}</p>
        <div className="mt-3 flex gap-2"><Link className="btn-primary" to={`/app/gaps?career=${c.id}`}>Analyse my skill gaps</Link><Link className="btn-ghost" to={`/app/roadmap?career=${c.id}`}>Open roadmap</Link></div></div>
      <div className="grid gap-4 md:grid-cols-2">
        <List title="Typical responsibilities" items={d.resp} />
        <List title="Required skills" items={c.required.map(s => `${s} ${userSkills.includes(s) ? '(you have this)' : '(missing)'}`)} />
        <List title="Recommended skills" items={optional.length ? optional : ['No extra recommendations in the sample data']} />
        <List title="Education" items={[m.education]} />
        <List title="Career progression" items={d.prog} />
        <List title="Example projects" items={d.projects} />
        <List title="Related careers" items={m.related} />
        <List title="Learning resources" items={res.map(r => `${r.title} (${r.type})`)} />
      </div>
      <p className="text-xs text-[#6e6e73]">Sample content for the demo. Scores are estimates, not employment predictions.</p>
    </div>
  )
}
