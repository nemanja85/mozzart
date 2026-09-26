<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMatchesStore } from '@/stores/app'
import type { MatchesProps } from '@/types'
import FilterSearch from './FilterSearch.vue'
import GameItem from './GameItem.vue'

const POLLING_INTERVAL_MS = 5000
const ANIMATION_DURATION_MS = 1000

const store = useMatchesStore()
const { filteredMatches, isLoading, error, allMatches } = storeToRefs(store)

let pollingInterval: ReturnType<typeof setInterval> | undefined

const updatedMatches = reactive<Record<string, boolean>>({})
const removedMatches = reactive<Record<string, boolean>>({})

const markAsRemoved = (matchId: string) => {
  removedMatches[matchId] = true

  setTimeout(() => {
    store.setMatches(store.allMatches.filter((match) => match.id !== matchId))
    delete removedMatches[matchId]
  }, ANIMATION_DURATION_MS)
}

const markAsUpdated = (matchId: string) => {
  updatedMatches[matchId] = true

  setTimeout(() => {
    delete updatedMatches[matchId]
  }, ANIMATION_DURATION_MS)
}

const setMatches = (newMatches: MatchesProps[]) => {
  const oldMatches = allMatches.value ?? []

  if (!newMatches.length && !oldMatches.length) {
    store.setMatches([])
    return
  }

  const newMatchIds = new Set(newMatches.map((m) => m.id))

  oldMatches.forEach((oldMatch) => {
    if (!newMatchIds.has(oldMatch.id)) {
      markAsRemoved(oldMatch.id)
    }
  })

  const matchesToUpdate = newMatches.filter((newMatch) => {
    const oldMatch = oldMatches.find((m) => m.id === newMatch.id)
    return (
      oldMatch &&
      (oldMatch.homeScore !== newMatch.homeScore || oldMatch.awayScore !== newMatch.awayScore)
    )
  })

  store.setMatches(newMatches)

  matchesToUpdate.forEach((match) => markAsUpdated(match.id))
}

const getMatches = async () => {
  const newMatches = await store.getLatestData()
  if (newMatches) {
    setMatches(newMatches)
  }
}

const startPolling = () => {
  getMatches()
  pollingInterval = setInterval(getMatches, POLLING_INTERVAL_MS)
}

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = undefined
  }
}

onMounted(startPolling)
onUnmounted(stopPolling)

watch(error, (newError) => {
  if (newError) {
    stopPolling()
  }
})
</script>

<template>
  <div class="space-y-2">
    <div
      v-if="error"
      class="p-4 bg-red-800 text-white text-center rounded-lg animate-fade-in"
      role="alert"
    >
      {{ error }}
    </div>

    <div v-else-if="isLoading" class="text-center p-8 text-slate-400" aria-live="polite">
      Učitavanje svih utakmica...
      <div class="mt-8 animate-pulse h-12 bg-slate-800 rounded-lg"></div>
    </div>

    <div v-else class="space-y-6">
      <FilterSearch />

      <div
        v-if="!filteredMatches?.length"
        class="text-center p-8 text-slate-400"
        aria-live="polite"
      >
        Nema dostupnih utakmica!
      </div>

      <GameItem
        v-for="match in filteredMatches"
        :key="match.id"
        :match="match"
        :updated-matches="updatedMatches"
        :removed-matches="removedMatches"
      />
    </div>
  </div>
</template>
