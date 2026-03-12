import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/HomeView.vue"
import Videos from "../pages/VideoView.vue"
import MyCoupons from "../pages/CouponView.vue"

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