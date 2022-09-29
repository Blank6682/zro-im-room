import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { user } from '@/composables/state';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})


router.beforeEach((to, form, next) => {
  if (to.path === '/login') {
    user.value = null
  } else {
    if (user !== null) {
      if (!user.value.userName) {
        return next({ path: '/login' })
      }
    } else {
      return next({ path: '/login' })
    }
  }
  return next()
})

export default router
