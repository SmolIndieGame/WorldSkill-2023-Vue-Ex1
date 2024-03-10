import Todo from './todo'

export default class Project {
  id: number = -1
  name?: string
  todos: Record<number, Todo> = {}

  todoIter() {
    return Object.values(this.todos)
  }

  assign(json: any) {
    this.id = Number.parseInt(json.id)
    this.name = json.name
    for (const key in json.todos) {
      const todo = new Todo()
      todo.assign(json.todos[key])
      this.todos[todo.id] = todo
    }
  }
}
