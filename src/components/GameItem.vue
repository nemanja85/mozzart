<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMatchesStore } from '@/stores/app'
import type { MatchesProps } from '@/types'

const props = defineProps<{
  match: MatchesProps
  updatedMatches: Record<string, boolean>
  removedMatches: Record<string, boolean>
}>()

const store = useMatchesStore()
const { favoriteMatch } = storeToRefs(store)

const isUpdated = computed(() => Boolean(props.updatedMatches[props.match.id]))
const isRemoved = computed(() => Boolean(props.removedMatches[props.match.id]))
const isFavorite = computed(() => favoriteMatch.value.includes(props.match.id))

const isLive = computed(() => props.match.status === 'live')
const isFinished = computed(() => props.match.status === 'finished')
const isUpcoming = computed(() => props.match.status === 'upcoming')

const showScore = computed(() => isLive.value || isFinished.value)

const sportEmoji = computed(() => {
  switch (props.match.sport) {
    case 'football':
      return '⚽'
    case 'basketball':
      return '🏀'
    case 'tennis':
      return '🎾'
    default:
      return ''
  }
})

const liveIndicator = computed(() => {
  if (!isLive.value) return null
  if (props.match.sport === 'football') return "75'"
  if (props.match.sport === 'basketball') return 'Q3 7:51'
  return null
})

const statusClasses = computed(() => ({
  'bg-red-500 hover:bg-red-500 animate-pulse': isLive.value,
  'bg-blue-500 hover:bg-blue-500': isUpcoming.value,
  'bg-slate-600 hover:bg-slate-600': isFinished.value,
}))

const containerClasses = computed(() => ({
  'border-red-500 animate-bounce-fade-in': isRemoved.value,
  'border-yellow-500 animate-bounce-fade-in': isUpdated.value,
  'bg-slate-900 border-slate-800 hover:border-slate-700': !isUpdated.value && !isRemoved.value,
}))

const scoreClasses = computed(() =>
  isUpdated.value ? 'text-yellow-300 transition-colors duration-1000' : 'text-emerald-500',
)
</script>

<template>
  <div
    class="flex flex-col gap-6 rounded-xl border overflow-hidden transition-colors"
    :class="containerClasses"
  >
    <div class="p-4">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-2 flex-1">
          <span v-if="sportEmoji" class="text-xl" aria-hidden="true">{{ sportEmoji }}</span>

          <span
            class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit shrink-0 border-transparent bg-slate-800 text-slate-300"
          >
            {{ props.match.league }}
          </span>

          <span
            class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit shrink-0 border-transparent text-primary-foreground"
            :class="statusClasses"
          >
            {{ props.match.status }}
          </span>

          <span v-if="liveIndicator" class="text-emerald-500 text-sm">
            {{ liveIndicator }}
          </span>
        </div>

        <button
          type="button"
          class="flex items-center gap-2 cursor-pointer group"
          :aria-label="isFavorite ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'"
          :aria-pressed="isFavorite"
          @click="store.setFavoriteMatch(props.match.id)"
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
            class="lucide lucide-star h-4 w-4 transition-colors"
            :class="{
              'text-yellow-400 fill-yellow-400': isFavorite,
              'text-slate-600 group-hover:text-slate-400': !isFavorite,
            }"
            aria-hidden="true"
          >
            <path
              d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
            />
          </svg>
        </button>
      </div>

      <div v-if="showScore" class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div class="text-right">
          <div class="text-white">{{ props.match.homeTeam }}</div>
        </div>
        <div class="flex items-center justify-center min-w-20">
          <div class="flex items-center gap-3">
            <span class="text-2xl" :class="scoreClasses">
              {{ props.match.homeScore }}
            </span>
            <span class="text-slate-500">-</span>
            <span class="text-2xl" :class="scoreClasses">
              {{ props.match.awayScore }}
            </span>
          </div>
        </div>
        <div class="text-left">
          <div class="text-white">{{ props.match.awayTeam }}</div>
        </div>
      </div>

      <div v-else-if="isUpcoming" class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <div class="text-right">
          <div class="text-white">{{ props.match.homeTeam }}</div>
        </div>
        <div class="flex items-center justify-center min-w-20">
          <div class="text-slate-500 text-sm">vs</div>
        </div>
        <div class="text-left">
          <div class="text-white">{{ props.match.awayTeam }}</div>
        </div>
      </div>

      <div class="mt-3 pt-3 border-t border-slate-800">
        <div class="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <span>{{ props.match.venue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
