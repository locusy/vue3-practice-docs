import {createRouter, createWebHashHistory} from 'vue-router'
// import Todo from './../views/Todo/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/todo',
      component: () => import('./../views/Todo/index.vue')
    }
  ]
})

router.beforeEach(() => {
})

router.afterEach(() => {
})

export default router