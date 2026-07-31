import axios from 'axios'
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ajaia_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && !error.config?.url?.endsWith('/auth/login')) {
    localStorage.removeItem('ajaia_token')
    window.dispatchEvent(new Event('ajaia:unauthorized'))
  }
  return Promise.reject(error)
})
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.detail ?? 'Could not reach Ajaia Docs.'
  return 'Something went wrong.'
}
