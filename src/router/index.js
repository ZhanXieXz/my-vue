import Vue from 'vue'
// import VueRouter from 'vue-router' 
import VueRouter from '../myRouter' 
import Home from '../views/Home.vue'

Vue.use(VueRouter) // 传入函数或者对象，传入函数会直接调用，对象的话会调用对象中的install方法

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About', 
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
