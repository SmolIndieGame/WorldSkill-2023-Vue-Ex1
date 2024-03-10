import Project from '@/models/project'
import type Todo from '@/models/todo'
import { computed, ref } from 'vue'

const Table = {
  project: 'project',
  maxIds: 'maxIds'
}

const projectsCache = ref<Record<number, Project>>({})
let maxId = 0
let maxTodoId = 0

export const events: { onSaveChanges?: () => void } = {}

const saveChanges = () => {
  localStorage.setItem(Table.project, JSON.stringify(projectsCache.value))
  localStorage.setItem(Table.maxIds, JSON.stringify({ maxId, maxTodoId }))
  if (events.onSaveChanges) events.onSaveChanges()
}

const init = () => {
  const data = localStorage.getItem(Table.project)
  if (!data) return
  const parsedData = JSON.parse(data)
  if (!parsedData) return
  console.log(parsedData)

  for (const key in parsedData) {
    const t = new Project()
    t.assign(parsedData[key])
    projectsCache.value[t.id] = t
  }

  const maxIds = localStorage.getItem(Table.maxIds)
  if (!maxIds) return
  const parsedMaxIds = JSON.parse(maxIds)
  if (!parsedMaxIds) return
  maxId = Number.parseInt(parsedMaxIds.maxId)
  maxTodoId = Number.parseInt(parsedMaxIds.maxTodoId)
}

export const projectIter = computed(() => Object.values(projectsCache.value))

export const get = (id: number) => projectsCache.value[id]

export const overdues = () => {
  const todos = Object.values(projectsCache.value).flatMap((v) => {
    if (v) return v.todoIter().map((x) => ({ todo: x, project: v }))
    return []
  })

  const overDues = [] as { todo: Todo; project: Project }[]

  for (const { todo, project } of todos) {
    if (!todo.dueDate) continue
    const due = new Date(todo.dueDate)
    const now = new Date()
    if (due.getFullYear() > now.getFullYear()) continue
    if (due.getFullYear() < now.getFullYear()) {
      overDues.push({ todo, project })
      continue
    }
    if (due.getMonth() > now.getMonth()) continue
    if (due.getMonth() < now.getMonth()) {
      overDues.push({ todo, project })
      continue
    }
    if (due.getDate() < now.getDate()) {
      overDues.push({ todo, project })
      continue
    }
  }
  return overDues
}

export const todays = () => {
  const todos = Object.values(projectsCache.value).flatMap((v) => {
    if (v) return v.todoIter().map((x) => ({ todo: x, project: v }))
    return []
  })

  const today = [] as { todo: Todo; project: Project }[]
  for (const { todo, project } of todos) {
    if (!todo.dueDate) continue
    const due = new Date(todo.dueDate)
    const now = new Date()
    const include =
      due.getFullYear() == now.getFullYear() &&
      due.getMonth() == now.getMonth() &&
      due.getDate() == now.getDate()
    if (include) today.push({ todo, project })
  }
  return today
}

export const add = (project: Project) => {
  if (!project.name) return 'name cannot be empty'
  for (const x of projectIter.value) if (x.name === project.name) return 'name must be unique'

  project.id = maxId
  maxId++

  projectsCache.value[project.id] = project
  saveChanges()
  return ''
}

export const edit = (project: Project) => {
  const originalProject = projectsCache.value[project.id]
  if (!originalProject) return 'project does not exists'
  if (!project.name) return 'name cannot be empty'

  originalProject.assign(project)
  saveChanges()
  return ''
}

export const remove = (id: number) => {
  if (!projectsCache.value[id]) return 'project does not exists'
  delete projectsCache.value[id]
  saveChanges()
  return ''
}

export const addTodo = (projectId: number, todo: Todo) => {
  if (!todo.title) return 'title cannot be empty'
  if (!projectsCache.value[projectId]) return 'project does not exists'

  todo.id = maxTodoId
  maxTodoId++

  projectsCache.value[projectId]!.todos[todo.id] = todo
  saveChanges()
  return ''
}

export const editTodo = (projectId: number, todo: Todo) => {
  if (!todo.title) return 'title cannot be empty'
  if (!projectsCache.value[projectId]) return 'project does not exists'
  const originalTodo = projectsCache.value[projectId]!.todos[todo.id]
  if (!originalTodo) return 'todo does not exists'

  Object.assign(originalTodo, todo)
  // projectsCache.value[projectId]!.todos[todo.id] = todo
  saveChanges()
  return ''
}

export const removeTodo = (projectId: number, todoId: number) => {
  if (!projectsCache.value[projectId]) return 'project does not exists'
  if (!projectsCache.value[projectId]!.todos[todoId]) return 'todo does not exists'

  delete projectsCache.value[projectId]!.todos[todoId]
  saveChanges()
  return ''
}

init()
