<script setup lang="ts">
import { matchesData } from '@/api'
// PAŽNJA: Koristim Vaš uvoz '@/stores/app'
import { useMatchesStore } from '@/stores/app'
import type { MatchesProps } from '@/types'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import FilterSearch from './FilterSearch.vue'

const store = useMatchesStore()
const { filteredMatches } = storeToRefs(store)

const isLoading = ref(true)
const error = ref<string | null>(null)
let pollingInterval: number | undefined = undefined

const updatedMatches = reactive<Record<string, boolean>>({})
const removedMatches = reactive<Record<string, boolean>>({})

function isError(err: unknown): err is Error {
  return err instanceof Error
}

const getMatches = async () => {
  if (!store.allMatches.length) {
    isLoading.value = true
  }
  error.value = null

  const oldMatches = store.allMatches

  try {
    const data = await matchesData()
    const newMatches: MatchesProps[] = data?.matches || []

    if (!newMatches.length && !oldMatches?.length) {
      store.setMatches([])
      return
    }

    const newMatchIds = newMatches.map((match) => match.id)
    oldMatches?.forEach((oldMatch) => {
      if (!newMatchIds.includes(oldMatch.id)) {
        removedMatches[oldMatch.id] = true

        setTimeout(() => {
          store.setMatches(store.allMatches.filter((m) => m.id !== oldMatch.id))
          delete removedMatches[oldMatch.id]
        }, 1000)
      }
    })

    const matchesToUpdate: MatchesProps[] = []

    newMatches.forEach((newMatch) => {
      const oldMatch = oldMatches?.find((item) => item.id === newMatch.id)

      if (
        oldMatch &&
        (oldMatch.homeScore !== newMatch.homeScore || oldMatch.awayScore !== newMatch.awayScore)
      ) {
        matchesToUpdate.push(newMatch)
      }
    })

    store.setMatches(newMatches)

    matchesToUpdate.forEach((m) => {
      updatedMatches[m.id] = true

      setTimeout(() => {
        delete updatedMatches[m.id]
      }, 1000)
    })
  } catch (err) {
    const errorMessage = isError(err) ? err.message : 'Došlo je do greške'
    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}

const startPolling = () => {
  const intervalDuration = 5000
  getMatches()
  pollingInterval = setInterval(getMatches, intervalDuration) as number
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})
</script>

<template>
  <div class="space-y-2">
    <FilterSearch />
    <div v-if="error" class="p-4 bg-red-800 text-white rounded-lg">
      Greška prilikom učitavanja: {{ error }}
    </div>

    <div v-else-if="isLoading" class="text-center p-8 text-slate-400">
      Učitavanje svih utakmica...
      <div class="mt-8 animate-pulse h-12 bg-slate-800 rounded-lg"></div>
    </div>
    <div
      v-else-if="!filteredMatches || filteredMatches.length === 0"
      class="text-center p-8 text-slate-400"
    >
      Nema dostupnih utakmica !
    </div>
    <div v-if="filteredMatches" class="space-y-6">
      <div
        v-for="match in filteredMatches"
        :key="match.id"
        class="flex flex-col gap-6 rounded-xl border bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition-colors"
        :class="{
          ' border-red-500 animate-pulse-fade-out': removedMatches[match.id],
          ' border-yellow-500 animate-pulse-fade-in': updatedMatches[match.id],
          'bg-slate-900 border-slate-800 hover:border-slate-700 animate-duration-100':
            !updatedMatches[match.id] && !removedMatches[match.id],
        }"
      >
        <div class="p-4">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-2 flex-1">
              <span v-if="match.sport === 'football'" class="text-xl">⚽</span>
              <span v-if="match.sport === 'basketball'" class="text-xl">>🏀</span>
              <span v-if="match.sport === 'tennis'" class="text-xl">🎾</span
              ><span
                class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-slate-800 text-slate-300 hover:bg-slate-800"
                >{{ match.league }}</span
              ><span
                class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 transition-[color,box-shadow] overflow-hidden border-transparent text-primary-foreground [a&amp;]:hover:bg-primary/90"
                :class="{
                  'bg-red-500 hover:bg-red-500 animate-pulse': match.status === 'live',
                  ' bg-blue-500 hover:bg-blue-500': match.status === 'upcoming',
                  'bg-slate-600 hover:bg-slate-600': match.status === 'finished',
                }"
                >{{ match.status }}</span
              ><span
                v-if="match.status === 'live' && match.sport === 'football'"
                class="text-emerald-500 text-sm"
                >75'</span
              >
              <span
                v-if="match.status === 'live' && match.sport === 'basketball'"
                class="text-emerald-500 text-sm"
                >Q3 08:51</span
              >
            </div>
            <div class="flex items-center gap-2">
              <div
                class="flex items-center gap-2 cursor-pointer group"
                @click="store.setFavoriteMatch(match.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-star h-4 w-4 transition-colors text-slate-600 group-hover:text-slate-400"
                  :class="{
                    'text-yellow-400 fill-yellow-400': store.favoriteMatch.includes(match.id),
                    'text-slate-600 group-hover:text-slate-400': !store.favoriteMatch.includes(
                      match.id,
                    ),
                  }"
                  aria-hidden="true"
                >
                  <path
                    d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div
            v-if="match.status === 'live' || match.status === 'finished'"
            class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center"
          >
            <div class="text-right">
              <div class="text-white">{{ match.homeTeam }}</div>
            </div>
            <div class="flex items-center justify-center min-w-20">
              <div class="flex items-center gap-3">
                <span class="text-2xl text-emerald-500">{{ match.homeScore }}</span
                ><span class="text-slate-500">-</span
                ><span class="text-2xl text-emerald-500">{{ match.awayScore }}</span>
              </div>
            </div>
            <div class="text-left">
              <div class="text-white">{{ match.awayTeam }}</div>
            </div>
          </div>
          <div
            v-else-if="match.status === 'upcoming'"
            class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center"
          >
            <div class="text-right">
              <div class="text-white">{{ match.homeTeam }}</div>
            </div>
            <div class="flex items-center justify-center min-w-20">
              <div class="text-slate-500 text-sm">vs</div>
            </div>
            <div class="text-left">
              <div class="text-white">{{ match.awayTeam }}</div>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800">
            <div class="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <span>{{ match.venue }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
