<script lang="ts"></script>

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
            <circle cx="11" cy="11" r="8"></circle></svg
          ><input
            type="text"
            class="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            placeholder="Search teams or leagues..."
            value=""
          />
        </div>
      </div>
      <div>
        <button
          type="button"
          role="combobox"
          aria-controls="radix-:r0:"
          aria-expanded="false"
          aria-autocomplete="none"
          class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 bg-slate-800 border-slate-700 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="lucide lucide-funnel h-4 w-4 mr-2 text-slate-400"
            aria-hidden="true"
          >
            <path
              d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
            ></path></svg
          ><span style="pointer-events: none">All Sports</span
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="lucide lucide-chevron-down size-4 opacity-50"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
      </div>
      <div>
        <button
          type="button"
          role="combobox"
          aria-controls="radix-:r1:"
          aria-expanded="false"
          aria-autocomplete="none"
          dir="ltr"
          class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 bg-slate-800 border-slate-700 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="lucide lucide-arrow-up-down h-4 w-4 mr-2 text-slate-400"
            aria-hidden="true"
          >
            <path d="m21 16-4 4-4-4"></path>
            <path d="M17 20V4"></path>
            <path d="m3 8 4-4 4 4"></path>
            <path d="M7 4v16"></path></svg
          ><span style="pointer-events: none">Time</span
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            class="lucide lucide-chevron-down size-4 opacity-50"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="flex gap-2 mt-4">
      <button class="px-4 py-2 rounded-lg transition-colors bg-emerald-600 text-white">All</button
      ><button
        class="px-4 py-2 rounded-lg transition-colors bg-slate-800 text-slate-400 hover:bg-slate-700"
      >
        Live</button
      ><button
        class="px-4 py-2 rounded-lg transition-colors bg-slate-800 text-slate-400 hover:bg-slate-700"
      >
        Upcoming</button
      ><button
        class="px-4 py-2 rounded-lg transition-colors bg-slate-800 text-slate-400 hover:bg-slate-700"
      >
        Finished
      </button>
    </div>
  </div>
</template>
