<script setup lang="ts">
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'
import Todo from '@/models/todo'
import TodoForm from './TodoForm.vue'

const todoList = ref(new Map<number, Todo>())
const overDues = ref([] as Todo[])
const normals = ref([] as Todo[])

const editing = ref<number | null | undefined>(undefined)
const maxId = ref(0)

const comp = (a?: string, b?: string) => {}

const updateRepresentation = () => {
  overDues.value = [] as Todo[]
  normals.value = [] as Todo[]
  for (const [, item] of todoList.value) {
    if (item.dueDate && Date.parse(item.dueDate) < new Date().getTime()) overDues.value.push(item)
    else normals.value.push(item)
  }
  overDues.value.sort(comp)
  overDues.value.sort(comp)
}

const onAdd = (item: Todo) => {
  item.id = maxId.value
  todoList.value.set(maxId.value, item)
  maxId.value++
  updateRepresentation()
}
const onCheck = (id: number) => {
  const todo = todoList.value.get(id)
  if (!todo) return
  todo.isDone = !todo?.isDone
}
const onEdit = (id: number, item: Todo) => {
  todoList.value.set(id, item)
  updateRepresentation()
}
const onRemove = (id: number) => {
  if (!confirm('Are you sure?')) return
  todoList.value.delete(id)
}
const onCancel = () => {
  editing.value = undefined
}
</script>

<template>
  <div>
    <h1>Todo</h1>
    <h2>Overdue</h2>
    <ul v-for="item in overDues" :key="item.id">
      <TodoItem
        :id="item.id"
        :item="item"
        :editable="editing === undefined"
        @check="onCheck"
        @edit="(id) => (editing = id)"
        @delete="onRemove"
      />
      <div v-if="editing === item.id">
        <TodoForm
          :todo="todoList.get(editing!)"
          @submit="(todo) => onEdit(editing!, todo)"
          @cancel="onCancel"
        />
      </div>
    </ul>
    <h2>Other</h2>
    <ul v-for="item in normals" :key="item.id">
      <TodoItem
        :id="item.id"
        :item="item"
        :editable="editing === undefined"
        @check="onCheck"
        @edit="(id) => (editing = id)"
        @delete="onRemove"
      />
      <div v-if="editing === item.id">
        <TodoForm
          :todo="todoList.get(editing!)"
          @submit="(todo) => onEdit(editing!, todo)"
          @cancel="onCancel"
        />
      </div>
    </ul>
    <div v-if="editing === undefined">
      <a href="#" @click.prevent="() => (editing = null)">Add</a>
    </div>
    <div v-if="editing === null">
      <TodoForm @submit="onAdd" @cancel="onCancel" />
    </div>
  </div>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
