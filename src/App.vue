<script setup lang="ts">
import FilterSearch from './components/FilterSearch.vue'
import GameCard from './components/GameCard.vue'
import Nav from './components/Nav.vue'
</script>

<template>
  <div class="bg-slate-950 h-screen">
    <Nav />
    <section>
      <div class="max-w-6xl mx-auto px-4 py-6">
        <FilterSearch />
        <div class="space-y-3">
          <GameCard />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
