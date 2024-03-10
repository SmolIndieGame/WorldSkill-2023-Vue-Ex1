<script setup lang="ts">
import Project from '@/models/project'
import { addTodo, editTodo, removeTodo } from '@/controllers/Todo/repo'
import { ref, watch } from 'vue'
import TodoForm from './TodoForm.vue'
import Todo from '@/models/todo'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
  todos: Todo[]
  projects: Record<number, Project>
  title: string
  projectId?: number
}>()

const editing = ref<number | null>()
const error = ref('')
const errorTimeout = ref<NodeJS.Timeout>()

watch(
  () => props.title,
  () => (editing.value = undefined)
)

const handleErr = (result: string) => {
  if (!result) return
  error.value = result
  if (errorTimeout.value) clearTimeout(errorTimeout.value)
  errorTimeout.value = setTimeout(() => (error.value = ''), 3000)
  return
}

const onAdd = (todo: Todo) => {
  if (props.projectId === undefined) return
  const ret = addTodo(props.projectId, todo)
  handleErr(ret)
}

const onCheck = (todo: Todo) => {
  todo.isDone = !todo?.isDone
  const ret = editTodo(props.projects[todo.id].id, todo)
  handleErr(ret)
}

const onEdit = (id: number, item: Todo) => {
  const ret = editTodo(props.projects[id].id, item)
  handleErr(ret)
  if (ret) return
  editing.value = undefined
}

const onRemove = (id: number) => {
  if (!confirm('Are you sure?')) return
  const ret = removeTodo(props.projects[id].id, id)
  handleErr(ret)
}

const onCancel = () => {
  editing.value = undefined
}
</script>
<template>
  <div>
    <h1>{{ title }}</h1>
    <ul v-for="item in todos" :key="item.id">
      <h4 v-if="projectId === undefined">{{ projects[item.id].name }}</h4>
      <TodoItem
        :id="item.id"
        :item="item"
        :editable="editing === undefined"
        :editing="editing === item.id"
        @check="() => onCheck(item)"
        @edit="() => (editing = item.id)"
        @delete="() => onRemove(item.id)"
      />
      <div v-if="editing === item.id">
        <TodoForm
          :todo="todos.find((x) => x.id === editing)"
          @submit="
            (todo) => {
              if (editing) onEdit(editing, todo)
            }
          "
          @cancel="onCancel"
        />
      </div>
    </ul>
    <div v-if="projectId !== undefined && editing === undefined">
      <a href="#" @click.prevent="() => (editing = null)">Add</a>
    </div>
    <div v-if="editing === null">
      <TodoForm @submit="onAdd" @cancel="onCancel" />
    </div>
    <p class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
h4 {
  font-weight: bold;
}

.error {
  color: red;
}
</style>
