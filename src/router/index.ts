import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodoViewVue from '@/components/Todo/TodoView.vue'
import CalenderViewVue from '@/components/Calender/CalenderView.vue'
import TodoProjectVue from '@/components/Todo/TodoProject.vue'
import { overdues, todays } from '@/controllers/Todo/repo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/todo',
      name: 'todo',
      component: TodoViewVue,
      children: [
        {
          path: '/todo/overdue',
          name: 'todoOverdue',
          component: TodoProjectVue,
          props: {
            type: 'overdue'
          }
        },
        {
          path: '/todo/',
          name: 'todoToday',
          component: TodoProjectVue,
          props: {
            type: 'today'
          }
        },
        {
          path: '/todo/project/:id',
          name: 'todoProject',
          component: TodoProjectVue,
          props: {
            type: 'project'
          }
        }
      ]
    },
    {
      path: '/calender',
      name: 'calender',
      component: CalenderViewVue
    }
  ]
})

export default router
