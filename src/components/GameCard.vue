<script setup lang="ts">
import { useMatchesStore } from '@/stores/app'
import type { MatchesProps } from '@/types'
import { onMounted, onUnmounted, reactive } from '@vue/runtime-core'
import { storeToRefs } from 'pinia'
import FilterSearch from './FilterSearch.vue'
import GameItem from './GameItem.vue'

const store = useMatchesStore()

const { filteredMatches, isLoading, error, allMatches } = storeToRefs(store)

let pollingInterval: number | undefined = undefined

const updatedMatches = reactive<Record<string, boolean>>({})
const removedMatches = reactive<Record<string, boolean>>({})

const setMatches = (newMatches: MatchesProps[]) => {
  const oldMatches = allMatches.value

  if (!newMatches.length && !oldMatches.length) {
    store.setMatches([])
    return
  }

  const newMatchIds = newMatches.map((match) => match.id)
  oldMatches?.forEach((oldMatch) => {
    if (!newMatchIds.includes(oldMatch.id)) {
      removedMatches[oldMatch.id] = true
      let intervalDuration = 1000

      setTimeout(() => {
        store.setMatches(store.allMatches.filter((match) => match.id !== oldMatch.id))
        delete removedMatches[oldMatch.id]
      }, intervalDuration)
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

  matchesToUpdate.forEach((match) => {
    updatedMatches[match.id] = true
    let intervalDuration = 1000

    setTimeout(() => {
      delete updatedMatches[match.id]
    }, intervalDuration)
  })
}

const getMatches = async () => {
  const newMatches = await store.getLatestData()
  if (newMatches) {
    setMatches(newMatches)
  }
}

const startPolling = () => {
  let intervalDuration = 5000
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
  <FilterSearch />
  <div class="space-y-2">
    <div v-if="error" class="p-4 bg-red-800 text-white text-center rounded-lg animate-fade-in">
      {{ error }}
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
    <div v-else class="space-y-6">
      <GameItem
        v-for="match in filteredMatches"
        :key="match.id"
        :match="match"
        :updatedMatches="updatedMatches"
        :removedMatches="removedMatches"
      />
    </div>
  </div>
</template>
