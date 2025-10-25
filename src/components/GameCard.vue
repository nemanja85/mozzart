<script setup lang="ts">
import { matchesData } from '@/api'
import type { MatchesProps } from '@/types'
import { QueryClient } from '@tanstack/vue-query'
import { onMounted, ref } from 'vue'

const queryClient = new QueryClient()

const matches = ref<MatchesProps[] | null>([])
const isLoading = ref(true)
const error = ref(null)

const getMatches = async () => {
  try {
    const data = await matchesData()
    console.log(data)

    matches.value = data?.matches
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Došlo je do greške'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getMatches()
})
</script>

<template>
  <QueryClientProvider :client="queryClient">
    <div class="space-y-4">
      <div
        v-if="matches"
        v-for="match in matches"
        :key="match.id"
        class="flex flex-col gap-6 rounded-xl border bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition-colors"
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
              ><span v-if="match.status === 'live'" class="text-emerald-500 text-sm">75'</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 text-slate-400">
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
                  class="lucide lucide-clock h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle></svg
                ><span class="text-sm">{{ match.lastUpdated }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 cursor-pointer group">
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
                    aria-hidden="true"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="match.status === 'live' || 'finished'"
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
            v-if="match.status === 'upcoming'"
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
              <span>•</span>
              <span>{{ match.matchTime }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        data-slot="card"
        class="text-card-foreground flex flex-col gap-6 rounded-xl border bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition-colors"
      >
        <div class="p-4">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-2 flex-1">
              <span class="text-xl">🎾</span
              ><span
                class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-slate-800 text-slate-300 hover:bg-slate-800"
                >Tennis</span
              ><span
                class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent text-primary-foreground [a&amp;]:hover:bg-primary/90 bg-blue-500 hover:bg-blue-500"
                >UPCOMING</span
              >
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 text-slate-400">
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
                  class="lucide lucide-clock h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle></svg
                ><span class="text-sm">14:00</span>
              </div>
              <div class="flex items-center gap-2">
                <label class="flex items-center gap-2 cursor-pointer group">
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
                    aria-hidden="true"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path></svg
                ></label>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div class="text-right"><div class="text-white">Novak Djokovic</div></div>
            <div class="flex items-center justify-center min-w-20">
              <div class="text-slate-500 text-sm">vs</div>
            </div>
            <div class="text-left"><div class="text-white">Carlos Alcaraz</div></div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800">
            <div class="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <span>Tomorrow</span><span>•</span><span>14:00</span>
            </div>
          </div>
        </div>
      </div>
      <div
        data-slot="card"
        class="text-card-foreground flex flex-col gap-6 rounded-xl border bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition-colors"
      >
        <div class="p-4">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-2 flex-1">
              <span class="text-xl">🏀</span
              ><span
                class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&amp;]:hover:bg-secondary/90 bg-slate-800 text-slate-300 hover:bg-slate-800"
                >NBA</span
              ><span
                class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent text-primary-foreground [a&amp;]:hover:bg-primary/90 bg-slate-600 hover:bg-slate-600"
                >FINISHED</span
              >
            </div>
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 text-slate-400">
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
                  class="lucide lucide-clock h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle></svg
                ><span class="text-sm">20:00</span>
              </div>
              <div class="flex items-center gap-2">
                <label class="flex items-center gap-2 cursor-pointer group">
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
                    aria-hidden="true"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    ></path></svg
                ></label>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div class="text-right"><div class="text-white">Brooklyn Nets</div></div>
            <div class="flex items-center justify-center min-w-20">
              <div class="flex items-center gap-3">
                <span class="text-2xl text-white">115</span><span class="text-slate-500">-</span
                ><span class="text-2xl text-white">121</span>
              </div>
            </div>
            <div class="text-left"><div class="text-white">Phoenix Suns</div></div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-800">
            <div class="flex items-center justify-center text-slate-500 text-sm">
              Final - Yesterday 20:00
            </div>
          </div>
        </div>
      </div>
    </div>
  </QueryClientProvider>
</template>
