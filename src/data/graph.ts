import type { SkillStatus } from '../types'
export type Cat = 'skill' | 'subject' | 'project' | 'experience' | 'certification' | 'career'
export interface GNode { id: string; label: string; cat: Cat; status?: SkillStatus; desc: string }
export const catMeta: Record<Cat, { label: string; color: string; radius: number }> = {
  skill: { label: 'Skills', color: '#007AFF', radius: 4.5 }, subject: { label: 'Subjects', color: '#AF52DE', radius: 5.5 },
  project: { label: 'Projects', color: '#34C759', radius: 3 }, experience: { label: 'Experience', color: '#FF9F0A', radius: 3.6 },
  certification: { label: 'Certifications', color: '#5AC8FA', radius: 6.2 }, career: { label: 'Careers', color: '#5856D6', radius: 7.4 },
}
// Demo data. No node is marked Verified: that status requires real evidence checks.
export const nodes: GNode[] = [
  { id: 'python', label: 'Python', cat: 'skill', status: 'Practised', desc: 'General-purpose language used for automation, data and robotics.' },
  { id: 'cad', label: 'CAD Design', cat: 'skill', status: 'Demonstrated', desc: 'Modelling mechanical parts and assemblies.' },
  { id: 'embc', label: 'Embedded C', cat: 'skill', status: 'Practised', desc: 'Firmware programming for microcontrollers.' },
  { id: 'control', label: 'Control Systems', cat: 'skill', status: 'Claimed', desc: 'Feedback loops and stability of dynamic systems.' },
  { id: 'ros', label: 'ROS', cat: 'skill', status: 'Claimed', desc: 'Robot Operating System middleware for robot software.' },
  { id: 'cv', label: 'Computer Vision', cat: 'skill', status: 'Claimed', desc: 'Extracting information from images and video.' },
  { id: 'mech', label: 'Engineering Mechanics', cat: 'subject', desc: 'Statics and dynamics from your degree.' },
  { id: 'math', label: 'Engineering Mathematics', cat: 'subject', desc: 'Calculus, linear algebra and differential equations.' },
  { id: 'circuits', label: 'Circuit Theory', cat: 'subject', desc: 'Analysis of electrical circuits.' },
  { id: 'rover', label: 'Line-following Rover', cat: 'project', desc: 'Arduino rover with PID steering.' },
  { id: 'arm', label: '3-DOF Robotic Arm', cat: 'project', desc: 'Designed, printed and programmed a small arm.' },
  { id: 'intern', label: 'Manufacturing Internship', cat: 'experience', desc: 'Six weeks on a CNC and assembly line.' },
  { id: 'pycert', label: 'Python Course Certificate', cat: 'certification', desc: 'Self-reported completion certificate. Not independently verified.' },
  { id: 'robotics', label: 'Robotics Engineer', cat: 'career', desc: 'Designs and programs robots.' },
  { id: 'mechatronics', label: 'Mechatronics Engineer', cat: 'career', desc: 'Integrates mechanics, electronics and software.' },
  { id: 'sim', label: 'Simulation Engineer', cat: 'career', desc: 'Builds models to predict system behaviour.' },
  { id: 'tpm', label: 'Technical Product Manager', cat: 'career', desc: 'Guides technical products from idea to launch.' },
]
export const edges: [string, string][] = [
  ['python', 'cv'], ['python', 'ros'], ['embc', 'control'], ['cad', 'mech'], ['control', 'math'], ['circuits', 'embc'], ['rover', 'embc'], ['rover', 'control'],
  ['arm', 'cad'], ['arm', 'python'], ['arm', 'ros'], ['intern', 'cad'], ['pycert', 'python'], ['robotics', 'ros'], ['robotics', 'python'], ['robotics', 'control'],
  ['robotics', 'cv'], ['mechatronics', 'embc'], ['mechatronics', 'control'], ['mechatronics', 'cad'], ['sim', 'python'], ['sim', 'math'], ['tpm', 'intern'], ['ros', 'control'],
]
/** Deterministic spherical layout: each category sits on its own shell. */
export function layout(): Record<string, [number, number, number]> {
  const out: Record<string, [number, number, number]> = {}
  ;(Object.keys(catMeta) as Cat[]).forEach((c, ci) => {
    const group = nodes.filter(n => n.cat === c)
    group.forEach((n, i) => {
      const y = 1 - (2 * (i + 0.5)) / group.length, r = Math.sqrt(1 - y * y), a = i * 2.399963 + ci * 1.3, R = catMeta[c].radius
      out[n.id] = [Math.cos(a) * r * R, y * R * 0.8, Math.sin(a) * r * R]
    })
  })
  return out
}
export const nextSteps: Record<Cat, string> = {
  skill: 'Build a small project that uses this skill and link it as evidence.', subject: 'Apply this subject in a practical project.',
  project: 'Add a description, a link and the skills it demonstrates.', experience: 'List the tasks you performed and the skills used.',
  certification: 'Attach the certificate or credential ID as evidence.', career: 'Review the missing skills for this career in Career Discovery.',
}
