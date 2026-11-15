import { useToast } from '../../contexts/ToastContext'
import { useRef, useState } from 'react'
import { Check, FileUp, Pencil, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { loadProfile, saveProfile, validateResume } from '../../data/profile'
import { profilesApi, resumeApi } from '../../services/api'
import type { User } from '../../types'

type Origin = 'explicit' | 'inferred' | 'confirmed'
interface Item { id: number; section: string; target: string | null; text: string; origin: Origin; state: 'pending' | 'approved' | 'rejected' }
const originLabel: Record<Origin, string> = { explicit: 'Mentioned in resume', inferred: 'Inferred (demo)', confirmed: 'Confirmed by you' }

export default function ResumeAnalysisPage() {
  const user = useAuth().user as User
  const toast = useToast()
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [err, setErr] = useState('')
  const [items, setItems] = useState<Item[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [edit, setEdit] = useState<{ id: number; text: string } | null>(null)
  const [msg, setMsg] = useState('')
  const [analysisMessage, setAnalysisMessage] = useState('')

  const pick = (f?: File) => { if (!f) return; const e = validateResume(f); setErr(e ?? ''); setFile(e ? null : f); setItems(null); setMsg(''); setAnalysisMessage('') }
  const run = async () => {
    if (!file || busy) return
    setBusy(true); setErr(''); setItems(null)
    try {
      const result = await resumeApi.analyse(file)
      setAnalysisMessage(result.message)
      setItems(result.suggestions.map((s, i) => ({ ...s, id: i, state: 'pending' as const })))
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Could not analyse this resume.')
    } finally { setBusy(false) }
  }
  const set = (id: number, patch: Partial<Item>) => setItems(l => l && l.map(i => (i.id === id ? { ...i, ...patch } : i)))
  const addToProfile = async () => {
    const p = await profilesApi.get(user.id, loadProfile(user)); let n = 0
    items?.filter(i => i.state === 'approved' && i.target).forEach(i => { const cur = p.sections[i.target!] ?? []; if (!cur.includes(i.text)) { p.sections[i.target!] = [...cur, i.text]; n++ } })
    await profilesApi.save(user.id, p); toast.push('Profile updated'); setMsg(n ? `Added ${n} approved item${n > 1 ? 's' : ''} to your profile.` : 'Nothing new to add. Approve some items first.')
  }
  const sections = items ? Array.from(new Set(items.map(i => i.section))) : []
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Resume Analysis</h1><p className="text-sm text-[#6e6e73]">Upload a PDF or DOCX (max 5 MB), then review what was found.</p></div>
      <div className="glass flex flex-col items-center gap-3 border-dashed p-8 text-center" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files[0]) }}>
        <FileUp className="text-[#007AFF]" /><input ref={input} type="file" className="sr-only" aria-label="Choose resume file" accept=".pdf,.docx" onChange={e => pick(e.target.files?.[0])} />
        <button className="btn-ghost" onClick={() => input.current?.click()}>Choose a file</button>
        {file && <p className="text-sm text-[#1d1d1f]">{file.name} <span className="text-[#6e6e73]">· {(file.size / 1024).toFixed(0)} KB · {file.name.split('.').pop()?.toUpperCase()}</span></p>}
        {err && <p role="alert" className="text-sm text-[#d70015]">{err}</p>}
        {file && <button className="btn-primary" disabled={busy} onClick={run}>{busy ? 'Analysing…' : 'Analyse resume'}</button>}
      </div>
      {items && <>
        <p role="status" className="rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 p-3 text-sm text-[#1d1d1f]">{analysisMessage}</p>
        {sections.map(sec => (
          <section key={sec} className="glass p-5"><h2 className="mb-3 font-medium text-[#1d1d1f]">{sec}</h2>
            <ul className="space-y-2">{items.filter(i => i.section === sec).map(i => (
              <li key={i.id} className={`flex flex-wrap items-center gap-2 rounded-lg bg-black/[0.05] px-3 py-2 text-sm ${i.state === 'rejected' ? 'opacity-40 line-through' : ''}`}>
                {edit?.id === i.id ? <input autoFocus className="input !py-1 flex-1" aria-label="Edit item" value={edit.text} onChange={e => setEdit({ id: i.id, text: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') { set(i.id, { text: edit.text.trim() || i.text }); setEdit(null) } }} /> : <span className="flex-1">{i.text}</span>}
                <span className="rounded-full border border-black/[0.08] px-2 py-0.5 text-xs">{originLabel[i.origin]}</span>
                {i.target && <>
                  <button aria-label={`Edit ${i.text}`} onClick={() => setEdit({ id: i.id, text: i.text })}><Pencil size={14} /></button>
                  <button aria-label={`Approve ${i.text}`} onClick={() => set(i.id, { state: 'approved', origin: 'confirmed' })}><Check size={16} className="text-[#248a3d]" /></button>
                  <button aria-label={`Reject ${i.text}`} onClick={() => set(i.id, { state: 'rejected' })}><X size={16} className="text-[#d70015]" /></button></>}
              </li>))}</ul></section>))}
        <div className="flex items-center gap-3"><button className="btn-primary" onClick={addToProfile}>Add approved items to profile</button>{msg && <span role="status" className="text-sm text-[#007AFF]">{msg}</span>}</div>
      </>}
    </div>
  )
}
