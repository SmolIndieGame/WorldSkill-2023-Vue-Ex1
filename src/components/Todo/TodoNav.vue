<script setup lang="ts">
import { projectIter, add, remove, edit } from '@/controllers/Todo/projectRepo'
import Project from '@/models/project'
import { ref } from 'vue'

const editing = ref<Record<number, Project | undefined>>({})
const projectForm = ref(new Project())
const error = ref('')

const handleErr = (result: true | string) => {
  if (result !== true) {
    error.value = result
    setTimeout(() => (error.value = ''), 1000)
    return
  }
}

const addProject = () => {
  const ret = add(projectForm.value)
  handleErr(ret)
  projectForm.value = new Project()
}

const startEditingProject = (project: Project) => {
  editing.value[project.id] = project
}
const editProject = (id: number) => {
  if (!editing.value[id]) return
  const ret = edit(editing.value[id]!)
  handleErr(ret)
  editing.value[id] = undefined
}

const removeProject = (id: number) => {
  const ret = remove(id)
  handleErr(ret)
}
</script>

<template>
  <nav>
    <h2>Projects</h2>
    <ul v-for="project in projectIter" :key="project.id">
      <li v-if="editing[project.id]">
        <input @change="(evt) => (editing[project.id].name = (evt.target as any).value)" />
        <a href="#" @click.prevent="() => editProject(project.id)">Done</a>
      </li>
      <li v-else>
        <RouterLink :to="`/todo/project/${project.id}`">{{ project.name }}</RouterLink>
        ⋅ <a href="#" @click.prevent="() => startEditingProject(project)">Edit</a> ⋅
        <a href="#" @click.prevent="() => removeProject(project.id)">Delete</a>
      </li>
    </ul>
    <form @submit.prevent="addProject">
      <input type="text" v-model="projectForm.name" />
      <button type="submit">Add</button>
    </form>
    <p>{{ error }}</p>
  </nav>
</template>

<style scoped>
p {
  color: red;
}
</style>
