<script setup lang="ts">
const isLeapYear = (year: number) => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
}
const getMaxDaysInMonth = (month: number, year: number) => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 1 && isLeapYear(year)) {
    return daysInMonth[month] + 1
  }
  return daysInMonth[month]
}

const cells = [] as { id: number; content: any }[]
const date = new Date()
date.setDate(1)
const day = date.getDay()
const maxDays = getMaxDaysInMonth(date.getMonth(), date.getFullYear())
for (let i = 0; i < 42; i++) {
  const dayOfMonth = i - day + 1
  cells.push({
    id: i,
    content: dayOfMonth >= 1 && dayOfMonth <= maxDays ? dayOfMonth : ''
  })
}
</script>

<template>
  <div class="calender">
    <div class="cell">S</div>
    <div class="cell">M</div>
    <div class="cell">T</div>
    <div class="cell">W</div>
    <div class="cell">T</div>
    <div class="cell">F</div>
    <div class="cell">S</div>
    <div class="cell" v-for="cell in cells" :key="cell.id">{{ cell.content }}</div>
  </div>
</template>

<style scoped>
.calender {
  display: grid;
  grid-template-columns: repeat(7, 20px);
  grid-template-rows: auto;
}
.cell {
  width: 20px;
  height: 20px;
  transition: background-color 0.1s;
  text-align: center;
  align-self: center;
  justify-self: center;
  user-select: none;
  cursor: pointer;
}

.cell:hover {
  background-color: gray;
}
</style>
