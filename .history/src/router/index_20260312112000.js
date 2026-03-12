import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Videos from "../pages/Videos.vue"
import MyCoupons from "../pages/MyCoupons.vue"

const routes = [

  { path: "/", component: Home },

  { path: "/videos", component: Videos },

  { path: "/coupons", component: MyCoupons }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router