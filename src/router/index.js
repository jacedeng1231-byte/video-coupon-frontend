import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/HomeView.vue"
import Videos from "../views/VideoView.vue"
import MyCoupons from "../views/CouponView.vue"

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