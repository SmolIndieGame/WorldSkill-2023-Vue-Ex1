<script setup lang="ts">
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

const todoList = ref(new Map<number, { content: string }>())

const maxId = ref(0)
const name = ref('')
const onAdd = () => {
  todoList.value.set(maxId.value, { content: name.value })
  maxId.value++
  name.value = ''
}
const onRemove = (id: number) => todoList.value.delete(id)
</script>

<template>
  <div>
    <div v-for="[id, content] in todoList" :key="id">
      <TodoItem :id="id" :content="content.content" :on-remove="onRemove"></TodoItem>
    </div>
    <form action="#" @submit="onAdd">
      <input v-model="name" />
      <input type="submit" value="add" />
    </form>
  </div>
</template>

<style scoped></style>
