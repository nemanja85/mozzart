<script setup lang="ts">
import { useMatchesStore, type SortBy } from '@/stores/app'
import { storeToRefs } from 'pinia'

const store = useMatchesStore()
const { searchTerm, selectedLeague, sortBy, availableLeagues } = storeToRefs(store)

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'default', label: 'Podrazumevano' },
  { value: 'time', label: 'Vremenu' },
  { value: 'alphabetical', label: 'Timu' },
]
</script>

<template>
  <div
    class="text-card-foreground flex flex-col gap-6 rounded-xl border bg-slate-900 border-slate-800 p-4 mb-6"
  >
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="md:col-span-2">
        <div class="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            aria-hidden="true"
          >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            type="text"
            :value="searchTerm"
            @input="store.setSearchTerm(($event.target as HTMLInputElement).value)"
            placeholder="Pretraži tim..."
            class="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>
      <select
        :value="selectedLeague"
        @change="store.setSelectedLeague(($event.target as HTMLSelectElement).value)"
        class="p-2 border bg-slate-800 border-slate-700 placeholder:text-slate-500 text-white rounded-md"
      >
        <option value="all">Odaberi Ligu</option>
        <option
          v-for="league in availableLeagues"
          :key="league"
          :value="league"
          v-if="league !== 'all'"
        >
          {{ league }}
        </option>
      </select>
      <select
        :value="sortBy"
        @change="store.setSortBy(($event.target as HTMLSelectElement).value as SortBy)"
        class="p-2 border bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-md"
      >
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
          Sortiraj po: {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>
