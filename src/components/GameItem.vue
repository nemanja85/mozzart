<script setup lang="ts">
import { useMatchesStore } from '@/stores/app'
import type { MatchesProps } from '@/types'
import { computed } from '@vue/runtime-core'
import { storeToRefs } from 'pinia'

const store = useMatchesStore()
const { favoriteMatch } = storeToRefs(store)

const props = defineProps<{
  match: MatchesProps
  updatedMatches: Record<string, boolean>
  removedMatches: Record<string, boolean>
}>()

const isUpdated = computed(() => props.updatedMatches[props.match.id])
const isRemoved = computed(() => props.removedMatches[props.match.id])
const isFavorite = computed(() => favoriteMatch.value.includes(props.match.id))
</script>

<template>
  <div
    :key="props.match.id"
    class="flex flex-col gap-6 rounded-xl border overflow-hidden transition-colors"
    :class="{
      ' border-red-500  animate-bounce-fade-in': isRemoved,
      ' border-yellow-500  animate-bounce-fade-in': isUpdated,
      'bg-slate-900 border-slate-800 hover:border-slate-700 animate-duration-100':
        !isUpdated && !isRemoved,
    }"
  >
    <div class="p-4">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-2 flex-1">
          <span v-if="props.match.sport === 'football'" class="text-xl">⚽</span>
          <span v-if="props.match.sport === 'basketball'" class="text-xl">🏀</span>
          <span v-if="props.match.sport === 'tennis'" class="text-xl">🎾</span
          ><span
            class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] overflow-hidden border-transparent bg-slate-800 text-slate-300 hover:bg-slate-800"
            >{{ props.match.league }}</span
          ><span
            class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] overflow-hidden border-transparent text-primary-foreground"
            :class="{
              'bg-red-500 hover:bg-red-500 animate-pulse': props.match.status === 'live',
              ' bg-blue-500 hover:bg-blue-500': props.match.status === 'upcoming',
              'bg-slate-600 hover:bg-slate-600': props.match.status === 'finished',
            }"
            >{{ props.match.status }}</span
          ><span
            v-if="props.match.status === 'live' && props.match.sport === 'football'"
            class="text-emerald-500 text-sm"
            >75'</span
          >
          <span
            v-if="props.match.status === 'live' && props.match.sport === 'basketball'"
            class="text-emerald-500 text-sm"
            >Q3 7:51</span
          >
        </div>
        <div class="flex items-center gap-2">
          <div
            class="flex items-center gap-2 cursor-pointer group"
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
              class="lucide lucide-star h-4 w-4 transition-colors text-slate-600 group-hover:text-slate-400"
              :class="{
                'text-yellow-400 fill-yellow-400': isFavorite,
                'text-slate-600 group-hover:text-slate-400': !isFavorite,
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
        v-if="props.match.status === 'live' || props.match.status === 'finished'"
        class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center"
      >
        <div class="text-right">
          <div class="text-white">{{ props.match.homeTeam }}</div>
        </div>
        <div class="flex items-center justify-center min-w-20">
          <div class="flex items-center gap-3">
            <span
              class="text-2xl"
              :class="{
                'text-yellow-300 transition-colors duration-1000': isUpdated,
                'text-emerald-500': !isUpdated,
              }"
              >{{ props.match.homeScore }}</span
            ><span class="text-slate-500">-</span
            ><span
              class="text-2xl"
              :class="{
                'text-yellow-300 transition-colors duration-1000': isUpdated,
                'text-emerald-500': !isUpdated,
              }"
              >{{ props.match.awayScore }}</span
            >
          </div>
        </div>
        <div class="text-left">
          <div class="text-white">{{ props.match.awayTeam }}</div>
        </div>
      </div>
      <div
        v-else-if="props.match.status === 'upcoming'"
        class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center"
      >
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
