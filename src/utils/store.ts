import { useState } from 'react'
/** localStorage-backed state for the demo. Swap for API calls when the backend exists. */
export function useStored<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => { try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : init } catch { return init } })
  return [v, n => { setV(n); try { localStorage.setItem(key, JSON.stringify(n)) } catch { /* storage unavailable */ } }]
}
export const isHttpUrl = (s: string) => { try { return /^https?:$/.test(new URL(s).protocol) } catch { return false } }
