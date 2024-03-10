<script setup lang="ts">
import { useRoute } from 'vue-router'
import Project from '@/models/project'
import { get, overdues, todays, events } from '@/controllers/Todo/repo'
import { ref, watch } from 'vue'
import Todo from '@/models/todo'
import TodoList from './TodoList.vue'

const props = defineProps<{ type: 'project' | 'overdue' | 'today' }>()
const route = useRoute()

const title = ref('')
const todos = ref<Todo[]>()
const projects = ref<Record<number, Project>>({})
const projectId = ref<number>()

const reload = () => {
  if (props.type === 'project') {
    if (!route.params.id) return
    const project = get(Number.parseInt(route.params.id.toString()))
    if (!project) return
    projectId.value = project.id
    title.value = project.name ?? ''
    todos.value = project.todoIter()
    for (const key in project.todos) {
      projects.value[key] = project
    }
  }
  if (props.type === 'overdue') {
    const ret = overdues()
    projectId.value = undefined
    title.value = 'Overdue'
    todos.value = ret.map((x) => x.todo)
    for (const item of ret) {
      projects.value[item.todo.id] = item.project
    }
  }
  if (props.type === 'today') {
    const ret = todays()
    projectId.value = undefined
    title.value = 'Today'
    todos.value = ret.map((x) => x.todo)
    for (const item of ret) {
      projects.value[item.todo.id] = item.project
    }
  }
}

events.onSaveChanges = reload
watch(() => route.params.id, reload)
watch(() => props.type, reload, { immediate: true })
</script>

<template>
  <div v-if="!todos">Loading project failed.</div>
  <div v-else>
    <TodoList :todos="todos" :title="title" :projects="projects" :project-id="projectId" />
  </div>
</template>
