import { useToast } from '../../contexts/ToastContext'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { assessmentsApi } from '../../services/api'
import type { Assessment } from '../../data/assessments'
import type { Result } from '../../data/evidence'
import { useRemote } from '../../hooks/useRemote'

export default function AssessmentPage() {
  const uid = useAuth().user?.id
  const toast = useToast()
  const [res, setRes] = useRemote<Result[]>('results', uid, [])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [a, setA] = useState<Assessment | null>(null)
  const [i, setI] = useState(0)
  const [ans, setAns] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [score, setScore] = useState(0)
  const [reviewAnswers, setReviewAnswers] = useState<number[]>([])
  const [note, setNote] = useState('')

  useEffect(() => {
    let active = true
    assessmentsApi.list().then(items => { if (active) setAssessments(items) })
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'Could not load assessments.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const begin = (x: Assessment) => {
    setA(x); setI(0); setAns(Array(x.questions.length).fill(-1))
    setDone(false); setScore(0); setReviewAnswers([]); setNote('')
  }
  const submit = async () => {
    if (!a || busy) return
    setBusy(true)
    try {
      const result = await assessmentsApi.submit(a.id, ans)
      setScore(result.score)
      setReviewAnswers(result.correctAnswers)
      setNote(result.feedback)
      setDone(true)
      setRes([...res, { id: Date.now().toString(36), assessment: a.title, skill: a.skill, score: result.score, total: result.total, date: new Date().toLocaleDateString() }])
      toast.push('Quiz submitted')
    } catch (error) {
      toast.push(error instanceof Error ? error.message : 'Could not submit assessment.', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Assessment Centre</h1><p className="text-sm text-[#6e6e73]">Practice quizzes for self-checking. They are not validated or certified assessments.</p></div>
      {!a && <>
        {loading && <div className="glass p-4 text-sm text-[#6e6e73]">Loading assessments…</div>}
        {loadError && <p role="alert" className="text-sm text-[#d70015]">{loadError}</p>}
        <div className="grid gap-3 sm:grid-cols-3">{assessments.map(x => <button key={x.id} className="glass p-4 text-left hover:bg-white/90" onClick={() => begin(x)}><p className="text-[#1d1d1f]">{x.title}</p><p className="text-xs text-[#6e6e73]">{x.questions.length} questions</p></button>)}</div>
        <section className="glass p-5"><h2 className="mb-2 font-medium text-[#1d1d1f]">Your results</h2>{res.length === 0 ? <p className="text-sm text-[#6e6e73]">No attempts yet. Pick a quiz to start.</p> : <ul className="space-y-1 text-sm">{res.map(r => <li key={r.id}>{r.assessment}: {r.score}/{r.total} · {r.date}</li>)}</ul>}</section>
      </>}
      {a && !done && (
        <section className="glass p-6"><p className="text-sm text-[#6e6e73]">Question {i + 1} of {a.questions.length}</p>
          <div className="mt-1 h-1.5 rounded-full bg-black/[0.05]" role="progressbar" aria-valuenow={i + 1} aria-valuemin={1} aria-valuemax={a.questions.length}><div className="h-1.5 rounded-full bg-nexus-cyan" style={{ width: `${((i + 1) / a.questions.length) * 100}%` }} /></div>
          <fieldset className="mt-4"><legend className="text-[#1d1d1f]">{a.questions[i].q}</legend>
            <div className="mt-3 space-y-2">{a.questions[i].options.map((o, n) => <label key={o} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${ans[i] === n ? 'border-[#007AFF] bg-[#007AFF]/10' : 'border-black/[0.08]'}`}><input type="radio" name="opt" checked={ans[i] === n} onChange={() => setAns(ans.map((v, k) => (k === i ? n : v)))} />{o}</label>)}</div></fieldset>
          <div className="mt-5 flex justify-between"><button className="btn-ghost" disabled={i === 0 || busy} onClick={() => setI(i - 1)}>Previous</button>
            {i < a.questions.length - 1 ? <button className="btn-primary" onClick={() => setI(i + 1)}>Next</button> : <button className="btn-primary" disabled={ans.includes(-1) || busy} onClick={submit}>{busy ? 'Submitting…' : 'Submit answers'}</button>}</div>
          {i === a.questions.length - 1 && ans.includes(-1) && <p className="mt-2 text-xs text-[#6e6e73]">Answer every question to submit.</p>}</section>)}
      {a && done && (
        <section className="glass space-y-3 p-6"><h2 className="text-xl font-semibold text-[#1d1d1f]">{score} / {a.questions.length}</h2><p>{a.skill}: {note}</p>
          <ul className="space-y-2 text-sm">{a.questions.map((q, n) => <li key={q.q}><span className={ans[n] === reviewAnswers[n] ? 'text-[#248a3d]' : 'text-[#d70015]'}>{ans[n] === reviewAnswers[n] ? 'Correct' : 'Incorrect'}</span> · {q.q}{ans[n] !== reviewAnswers[n] && <span className="text-[#6e6e73]"> Answer: {q.options[reviewAnswers[n]]}</span>}</li>)}</ul>
          <p className="text-xs text-[#6e6e73]">A score of 70% or more counts as Practised evidence in SkillProof.</p><button className="btn-primary" onClick={() => setA(null)}>Back to assessments</button></section>)}
    </div>
  )
}
