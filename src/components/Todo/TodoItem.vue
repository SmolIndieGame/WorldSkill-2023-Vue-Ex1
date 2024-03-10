<script setup lang="ts">
import type Todo from '@/models/todo'

defineProps<{
  id: number
  item: Todo
  editable: boolean
  editing: boolean
}>()

defineEmits<{
  edit: [id: number]
  delete: [id: number]
  check: [id: number]
}>()
</script>

<template>
  <li>
    <div class="flex-h">
      <label class="block">
        <input
          class="tick"
          type="checkbox"
          :value="item.isDone"
          @click="() => $emit('check', id)"
        />
        <span :class="{ 'line-through': item.isDone }">
          {{ item.title }}
        </span>
      </label>
      ⋅ {{ item.dueDate }}
      <div v-if="editable">
        <a href="#" @click.prevent="() => $emit('edit', id)">Edit</a>
      </div>
      <div v-if="editing">(editing)</div>
      <div>
        <a href="#" @click.prevent="() => $emit('delete', id)">Remove</a>
      </div>
    </div>
    <div :class="'indented'">
      {{ item.desc }}
    </div>
  </li>
</template>

<style scoped>
.flex-h {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}

.block {
  display: block;
}

.tick {
  display: inline-block;
  margin-right: 8px;
}

.indented {
  margin-left: 24px;
}
.line-through {
  text-decoration: line-through;
}
</style>
