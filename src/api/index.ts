import { ref } from 'vue'
import type { MatchesProps, MatchesResponse } from '@/types'

const API_URL = `${import.meta.env.VITE_APP_API_URL}/matches`
const USERNAME = import.meta.env.VITE_APP_USERNAME

if (!import.meta.env.VITE_APP_API_URL) {
  throw new Error('VITE_APP_API_URL nije definisan u .env fajlu')
}

if (!USERNAME) {
  throw new Error('VITE_APP_USERNAME nije definisan u .env fajlu')
}

const matches = ref<MatchesProps[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export const matchesData = async (): Promise<MatchesResponse | null> => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        username: USERNAME,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`)
    }

    const data: MatchesResponse = await response.json()
    matches.value = data.matches
    return data
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Nepoznata greška'
    console.error('Failed to fetch matches:', e)
    return null
  } finally {
    isLoading.value = false
  }
}

export { matches, isLoading, error }
