<script setup lang="ts">
import { projectIter, add, remove, edit } from '@/controllers/Todo/repo'
import Project from '@/models/project'
import router from '@/router'
import { ref } from 'vue'

const editing = ref<Record<number, Project | undefined>>({})
const projectForm = ref(new Project())
const error = ref('')
const errorTimeout = ref(0)

const handleErr = (result: string) => {
  if (!result) return
  error.value = result
  if (errorTimeout.value) clearTimeout(errorTimeout.value)
  errorTimeout.value = setTimeout(() => (error.value = ''), 3000) as unknown as number
  return
}

const addProject = () => {
  const ret = add(projectForm.value)
  handleErr(ret)
  projectForm.value = new Project()
}

const startEditingProject = (project: Project) => {
  const newProj = new Project()
  Object.assign(newProj, project)
  editing.value[project.id] = newProj
}
const cancelEditingProject = (id: number) => {
  editing.value[id] = undefined
}

const editProject = (id: number) => {
  if (!editing.value[id]) return
  const ret = edit(editing.value[id]!)
  handleErr(ret)
  if (!ret) editing.value[id] = undefined
}

const removeProject = (id: number) => {
  if (!confirm('Are you sure?')) return
  const ret = remove(id)
  handleErr(ret)
  if (ret) return
  router.push('/todo/')
}
</script>

<template>
  <nav>
    <h3>
      <RouterLink :class="{ highlight: $route.path.includes('overdue') }" to="/todo/overdue"
        >Overdues</RouterLink
      >
    </h3>
    <h3>
      <RouterLink
        :class="{ highlight: $route.path.endsWith('/todo') || $route.path.endsWith('/todo/') }"
        to="/todo/"
        >Today</RouterLink
      >
    </h3>
    <h2>Projects</h2>
    <ul v-for="project in projectIter" :key="project.id">
      <li v-if="editing[project.id]">
        <input
          class="edit"
          :value="editing[project.id]?.name"
          @change="(evt) => (editing[project.id]!.name = (evt.target as any).value)"
        />
        <a href="#" @click.prevent="() => editProject(project.id)">Done</a>
        &nbsp;<a href="#" @click.prevent="() => cancelEditingProject(project.id)">Cancel</a>
      </li>
      <li v-else>
        <RouterLink
          :class="{ highlight: $route.params.id?.toString() === project.id.toString() }"
          :to="`/todo/project/${project.id}`"
          >{{ project.name }}</RouterLink
        >
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
.edit {
  display: inline-block;
  width: 100px;
}

.highlight {
  background-color: hsla(160, 100%, 37%, 0.2);
}

p {
  color: red;
}
</style>
