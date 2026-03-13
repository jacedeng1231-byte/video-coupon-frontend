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
          pictureUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
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
        pictureUrl: profile.pictureUrl
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
    <nav class="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/"> 活動中心 </router-link>

        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav me-auto">
            <router-link class="nav-link" to="/dashboard"> 後台 </router-link>
            <router-link class="nav-link" to="/videos"> 影片 </router-link>
            <router-link class="nav-link" to="/coupons"> 我的優惠券 </router-link>
          </div>

          <!-- 使用者資訊 -->
          <div v-if="user" class="d-flex align-items-center mt-3 mt-lg-0">
            <img 
              v-if="user.pictureUrl"
              :src="user.pictureUrl" 
              class="rounded-circle me-2 border border-white" 
              style="width: 32px; height: 32px; object-fit: cover;"
              alt="User Avatar"
            />
            <span class="text-white fw-medium">
              {{ user.displayName }}
            </span>
          </div>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>