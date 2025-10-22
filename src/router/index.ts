import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Team from '../views/Team.vue'
import Mine from '../views/Mine.vue'
import Test from '../views/Test.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/team',
    name: 'Team',
    component: Team,
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
