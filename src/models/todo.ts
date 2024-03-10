export default class Todo {
  id: number = -1
  title?: string
  desc?: string
  dueDate?: string
  isDone: boolean = false

  assign(json: any) {
    this.id = Number.parseInt(json.id)
    this.title = json.title
    this.desc = json.desc
    this.dueDate = json.dueDate
    this.isDone = json.isDone
  }
}
