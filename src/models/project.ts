export default class Project {
    id: number = -1
    name?: string
    
    todos() {

    }

    assign(json: any) {
        this.id = Number.parseInt(json.id);
        this.name = json.name;
    }
}