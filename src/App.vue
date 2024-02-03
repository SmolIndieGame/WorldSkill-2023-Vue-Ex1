<script setup lang="ts">
import TodoList from './components/Todo/TodoList.vue'
import CalenderView from './components/Calender/CalenderView.vue'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> | <RouterLink to="/todo">Todo</RouterLink> |
      <RouterLink to="/calender">Calender</RouterLink>
    </nav>
  </header>
  <aside></aside>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
aside {
  display: block;
  height: 2rem;
}
</style>

<style>
body {
  display: block;
  padding: 4px;
}
</style>
