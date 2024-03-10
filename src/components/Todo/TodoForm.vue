<script setup lang="ts">
import Todo from '@/models/todo'
import { ref, watch } from 'vue'

const props = defineProps<{
  todo?: Todo
}>()
const emit = defineEmits<{
  submit: [todo: Todo]
  cancel: []
}>()

const initTodo = (todo?: Todo) => {
  if (!todo) return new Todo()
  const t = new Todo()
  Object.assign(t, todo)
  return t
}

watch(props, (_, x) => {
  formData.value = initTodo(x.todo)
})

const formData = ref(initTodo(props.todo))
const onSubmit = () => {
  emit('submit', formData.value)
  formData.value = new Todo()
}
const onCancel = () => {
  emit('cancel')
  formData.value = initTodo(props.todo)
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>
        Title
        <input v-model="formData.title" />
      </label>
    </div>
    <div>
      <label>
        Desc
        <input v-model="formData.desc" />
      </label>
    </div>
    <div>
      <label>
        Due
        <input v-model="formData.dueDate" type="date" />
      </label>
    </div>
    <div>
      <input type="submit" value="Ok" />
      <button @click.prevent="onCancel">Cancel</button>
    </div>
  </form>
</template>
