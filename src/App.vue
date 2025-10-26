<script setup lang="ts">
import GameCard from './components/GameCard.vue'
import Nav from './components/Nav.vue'
</script>

<template>
  <div class="h-auto bg-slate-950 overflow-auto">
    <Nav />
    <section class="max-w-6xl mx-auto px-4 py-6 bg-slate-950">
      <GameCard />
    </section>
  </div>
</template>

<style scoped></style>
