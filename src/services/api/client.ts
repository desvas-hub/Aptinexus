export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
export const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK !== 'false'
let accessToken: string | null = null // in memory only; never persisted
export const setAccessToken = (t: string | null) => { accessToken = t }

/** Single entry point for every API module. With VITE_USE_MOCK=false it calls the real REST backend. */
export async function request<T>(path: string, init: RequestInit | undefined, mock: () => Promise<T>): Promise<T> {
  if (USE_MOCK) return mock()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...init?.headers },
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json() as Promise<T>
}
