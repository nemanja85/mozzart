<script setup lang="ts">
import GameCard from './components/GameCard.vue'
import AppNav from './components/AppNav.vue'
</script>

<template>
  <div class="h-screen bg-slate-950 overflow-auto">
    <AppNav />
    <section class="max-w-6xl mx-auto px-4 py-6 bg-slate-950">
      <GameCard />
    </section>
  </div>
</template>

<style scoped></style>
