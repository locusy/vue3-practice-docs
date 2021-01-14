import {createRouter, createWebHashHistory} from 'vue-router'
// import Todo from './../views/Todo/index.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/todo',
      component: () => import('./../views/Todo/index.vue')
    }
  ]
})