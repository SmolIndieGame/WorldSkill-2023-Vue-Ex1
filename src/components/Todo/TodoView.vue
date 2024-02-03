<script setup lang="ts">
import TodoNav from './TodoNav.vue'
</script>

<template>
  <div class="container">
    <div class="nav">
      <TodoNav />
    </div>
    <div class="project">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 1rem;
}
.nav {
  background-color: lightgray;
}
.project {
  background-color: aliceblue;
}
</style>
