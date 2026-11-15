import { useState } from 'react'
import { careers, estimateFor, userSkills } from '../../data/careers'

const statuses = [
  ['Claimed', 'You list the skill, with no evidence yet.'], ['Practised', 'You have some evidence, such as a quiz result or a project.'],
  ['Demonstrated', 'A project or demonstration with a link shows the skill in use.'], ['Verified', 'Independently reviewed. AptiNexus never assigns this automatically.'],
]
const list = [
  ['SkillGraph', 'An interactive 3D map linking skills, subjects, projects and careers.'], ['Career Discovery', 'Career suggestions with estimated compatibility and the reasons behind them.'],
  ['Skill Gap Analysis', 'Missing skills grouped by priority, with dependencies.'], ['Learning Roadmap', 'Ordered stages, tasks and milestones you can track.'],
  ['SkillProof', 'Evidence for each skill, from claimed to demonstrated.'], ['Assessment Centre', 'Practice quizzes for self-checking.'],
  ['What-If Simulator', 'Test hypothetical skills and projects without changing your profile.'], ['Progress & Analytics', 'Charts of your skills, projects and results.'],
]
export default function FeaturesPage() {
  const [st, setSt] = useState(0)
  const [extra, setExtra] = useState<string[]>([])
  const c = careers[0], opts = ['ROS', 'Computer Vision']
  return (
    <section className="mx-auto max-w-5xl px-5 pt-16">
      <h1 className="text-3xl font-semibold text-[#1d1d1f] md:text-4xl">Features</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{list.map(([t, d]) => <div key={t} className="glass p-4"><h2 className="font-medium text-[#1d1d1f]">{t}</h2><p className="mt-1 text-sm text-[#6e6e73]">{d}</p></div>)}</div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="glass p-5"><h2 className="font-medium text-[#1d1d1f]">Try it: SkillProof</h2>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Skill status">{statuses.map(([s], i) => <button key={s} aria-pressed={st === i} onClick={() => setSt(i)} className={`btn-ghost !py-1.5 ${st === i ? 'bg-[#007AFF]/10 text-[#007AFF]' : ''}`}>{s}</button>)}</div>
          <p className="mt-3 text-sm" role="status">{statuses[st][1]}</p></div>
        <div className="glass p-5"><h2 className="font-medium text-[#1d1d1f]">Try it: What-If</h2>
          <p className="mt-1 text-sm text-[#6e6e73]">Estimate for {c.title} with sample skills. Add skills to see it change.</p>
          <div className="mt-3 flex gap-2">{opts.map(o => <button key={o} aria-pressed={extra.includes(o)} onClick={() => setExtra(e => (e.includes(o) ? e.filter(x => x !== o) : [...e, o]))} className={`btn-ghost !py-1.5 ${extra.includes(o) ? 'bg-[#007AFF]/10 text-[#007AFF]' : ''}`}>{o}</button>)}</div>
          <p className="mt-3 text-2xl text-[#007AFF]">~{estimateFor(c, [...userSkills, ...extra])}%</p><p className="text-xs text-[#6e6e73]">Hypothetical estimate, not a prediction.</p></div>
      </div>
    </section>
  )
}
