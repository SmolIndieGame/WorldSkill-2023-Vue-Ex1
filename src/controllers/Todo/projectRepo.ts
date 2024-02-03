import Project from "@/models/project"
import { computed, ref } from "vue";

const Table = {
    project: "project"
}

const projectsCache = ref<Record<number, Project | undefined>>({});
let maxId = 0;

const saveChanges = () => {
    localStorage.setItem(Table.project, JSON.stringify(projectsCache.value));
}

export const init = () => {
    const data = localStorage.getItem(Table.project)
    if (!data) return
    const parsedData = JSON.parse(data);
    if (!parsedData) return;

    for (const key in parsedData)
    {
        const t = new Project();
        t.assign(parsedData[key]);
        projectsCache.value[t.id] = t;
        maxId = Math.max(maxId, t.id + 1);
    }
}

export const projectIter = computed(() => Object.entries(projectsCache.value).flatMap(v => v[1] === undefined ? [] : v[1]));

export const add = (project : Project) => {
    if (!project.name) return "must enter a name"
    for (const x of projectIter.value)
        if (x.name === project.name) return "name must be unique"

    project.id = maxId;
    maxId++;
    
    projectsCache.value[project.id] = project;
    saveChanges();
    console.log(JSON.stringify(projectsCache.value))
    return true;
}

export const edit = (project : Project) => {
    const originalProject = projectsCache.value[project.id]
    if (!originalProject) return "project does not exists"

    originalProject.assign(project);
    saveChanges();
    return true;
}

export const remove = (id: number) => {
    if (!projectsCache.value[id]) return "project does not exists"
    projectsCache.value[id] = undefined;
    saveChanges();
    return true;
}

init();