import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { CHECK_AUTH } from '../store/actions.type'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Signup.vue'),
      meta: {
        beforeAuth: true
      }
    },
    {
      path: '/',
      alias: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        beforeAuth: true
      }
    },
    {
      path: '/secret',
      name: 'secret',
      component: () => import('../views/Secret.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth.isAuthenticated) {
      next({
        name: 'login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      return store.dispatch(CHECK_AUTH).then(next).catch(() => {
        next({
          name: 'login',
          params: { nextUrl: to.fullPath }
        })
      })
    }
  } else if (to.matched.some(record => record.meta.beforeAuth)) {
    if (store.state.auth.isAuthenticated) {
      next({
        name: 'secret'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
