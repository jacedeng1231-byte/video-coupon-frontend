import { createRouter, createWebHashHistory } from "vue-router"

import Home from "../views/HomeView.vue"
import Videos from "../views/VideoView.vue"
import MyCoupons from "../views/CouponView.vue"
import AdminVideos from "../backend/AdminVideos.vue"
import AdminCoupons from "../backend/AdminCoupons.vue"
import Dashboard from '../backend/AdminDashboard.vue'

const routes = [

  { path: "/", component: Home },

  { path: "/videos", component: Videos },

  { path: "/coupons", component: MyCoupons },

  { path: "/dashboard",
    component: Dashboard,
    children: [
      {path: "videos", component: AdminVideos },
      {path: "coupons", component: AdminCoupons },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router