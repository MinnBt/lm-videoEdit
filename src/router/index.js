import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

var routes = [
  {
    path: '/',
    name: '首页',
    component:()=>import('../views/index'),
    children:[ ]
  },
]

const path = require('path')
const files = require.context('@/views/compons/', true, /\.vue$/)

files.keys().forEach(key => {
  routes[0].children.push({
      path:'/'+path.basename(key, '.vue'),
      name:files(key).default.name||path.basename(key, '.vue'),
      component:files(key).default||files(key),
    })
})
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
