<script>
import api from "./api/api";
import { initLiff } from "./liff/liffInit";

export default {
  data() {
    return {
      user: null,
    };
  },
  async mounted() {
    try {
      let profile;

      // 開發模式
      if (import.meta.env.DEV) {
        profile = {
          userId: "test-user",
          displayName: "Local User",
        };
      } else {
        // Production 使用 LIFF
        profile = await initLiff();
        if (!profile) return;
      }

      console.log("LINE profile:", profile);
      this.user = profile;

      const res = await api.post("/users/login", {
        lineUserId: profile.userId,
        name: profile.displayName,
      });

      localStorage.setItem("userId", res.data._id);
    } catch (err) {
      console.error("LIFF Login Error:", err);
    }
  },
};
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container">
        <router-link class="navbar-brand" to="/"> 活動中心 </router-link>

        <div class="navbar-nav">
          <router-link class="nav-link" to="/dashboard"> 後台 </router-link>

          <router-link class="nav-link" to="/videos"> 影片 </router-link>

          <router-link class="nav-link" to="/coupons"> 我的優惠券 </router-link>
        </div>

        <!-- 使用者資訊 -->
        <div v-if="user" class="d-flex align-items-center">
          <span class="text-white">
            {{ user.displayName }}
          </span>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>