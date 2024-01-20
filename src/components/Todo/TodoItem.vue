<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  id: number
  content: string
  onRemove: (id: number) => void
}>()

const tick = ref(false)
</script>

<template>
  <div>
    <label>
      <input type="checkbox" v-model="tick" />
      <span v-if="tick">
        <strong>
          {{ content }}
        </strong>
      </span>
      <span v-else>
        {{ content }}
      </span>
    </label>
    <button @click="() => onRemove(id)">Remove</button>
  </div>
</template>

<style scoped></style>
