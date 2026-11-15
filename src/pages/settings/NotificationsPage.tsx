import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRemote } from '../../hooks/useRemote'

const items = [
  { id: 'n1', type: 'Learning reminder', text: 'You planned 5 hours of learning this week. Start with your next roadmap task.' },
  { id: 'n2', type: 'Roadmap milestone', text: 'You are one task away from finishing your current roadmap stage.' },
  { id: 'n3', type: 'Skill recommendation', text: 'Computer Vision connects several careers in your SkillGraph.' },
  { id: 'n4', type: 'Assessment result', text: 'Your latest practice quiz result is in Progress & Analytics.' },
  { id: 'n5', type: 'Profile update', text: 'Add your certifications to improve profile completion.' },
  { id: 'n6', type: 'Skill recommendation', text: 'Link a project to Python to move it from Practised toward Demonstrated.' },
]
export default function NotificationsPage() {
  const uid = useAuth().user?.id
  const [read, setRead] = useRemote<string[]>('notifRead', uid, [])
  const [type, setType] = useState('All')
  const types = ['All', ...Array.from(new Set(items.map(i => i.type)))]
  const list = items.filter(i => type === 'All' || i.type === type)
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-end justify-between"><div><h1 className="text-2xl font-semibold text-[#1d1d1f]">Notifications</h1><p className="text-sm text-[#6e6e73]">Sample notifications for the demo.</p></div>
        <button className="btn-ghost" onClick={() => setRead(items.map(i => i.id))}>Mark all as read</button></div>
      <select className="input !w-auto" aria-label="Filter by type" value={type} onChange={e => setType(e.target.value)}>{types.map(t => <option key={t}>{t}</option>)}</select>
      {list.length === 0 && <p className="glass p-6">No notifications of this type.</p>}
      <ul className="space-y-2">{list.map(i => { const r = read.includes(i.id)
        return <li key={i.id} className={`glass flex items-start justify-between gap-3 p-4 ${r ? 'opacity-60' : ''}`}><div><p className="text-xs text-[#6e6e73]">{i.type}{!r && ' · New'}</p><p className="text-sm text-[#1d1d1f]">{i.text}</p></div>
          <button className="text-xs text-[#007AFF]" onClick={() => setRead(r ? read.filter(x => x !== i.id) : [...read, i.id])}>{r ? 'Mark unread' : 'Mark read'}</button></li> })}</ul>
    </div>
  )
}
