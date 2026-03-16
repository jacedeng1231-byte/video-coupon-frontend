import { createRouter, createWebHashHistory } from "vue-router"

import Home from "../views/HomeView.vue"
import Videos from "../views/VideoView.vue"
import MyCoupons from "../views/CouponView.vue"
import AdminVideos from "../backend/AdminVideos.vue"
import AdminCoupons from "../backend/AdminCoupons.vue"
import AdminUsers from "../backend/AdminUsers.vue"
import Dashboard from '../backend/AdminDashboard.vue'

const routes = [
  { path: "/", component: Videos },

  { path: "/member", component: Home },

  { path: "/coupons", component: MyCoupons },

  { path: "/dashboard",
    component: Dashboard,
    children: [
      {path: "videos", component: AdminVideos },
      {path: "coupons", component: AdminCoupons },
      {path: "users", component: AdminUsers },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router