<template>
  <div class="container mt-4">
    <div v-if="user" class="text-center mb-5 p-4 bg-light rounded shadow-sm">
      <img
        v-if="user.pictureUrl"
        :src="user.pictureUrl"
        class="rounded-circle mb-3 border border-4 border-white shadow"
        style="width: 80px; height: 80px; object-fit: cover"
        alt="User Avatar"
      />
      <h3 class="fw-bold mb-1">歡迎, {{ user.displayName }}!</h3>
      <p class="text-muted">很高興見到您來到 LINE 活動中心</p>
    </div>

    <h2 v-else class="text-center mb-4">LINE 活動中心</h2>

    <div class="row g-3">
      <div class="col-6">
        <router-link to="/videos" class="text-decoration-none">
          <div
            class="card h-100 text-center shadow-sm p-3 border-0 bg-white hover-zoom"
          >
            <h1 class="mb-3">🎬</h1>
            <h5 class="fw-bold">觀看影片</h5>
            <p class="small text-muted mb-0">觀看影片賺取積分</p>
          </div>
        </router-link>
      </div>

      <div class="col-6">
        <router-link to="/coupons" class="text-decoration-none">
          <div
            class="card h-100 text-center shadow-sm p-3 border-0 bg-white hover-zoom"
          >
            <h1 class="mb-3">🎁</h1>
            <h5 class="fw-bold">我的優惠券</h5>
            <p class="small text-muted mb-0">查看您的獎勵</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api/api";
import { initLiff } from "../liff/liffInit";

export default {
  data() {
    return {
      user: null,
      latestVideo: null,
    };
  },

  async mounted() {
    try {
      let profile;

      if (import.meta.env.DEV) {
        profile = {
          displayName: "Local User",
          pictureUrl:
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        };
      } else {
        profile = await initLiff();
      }

      this.user = profile;

      const res = await api.get("/videos/latest");
      this.latestVideo = res.data;
    } catch (err) {
      console.error("HomeView error:", err);
    }
  },
};
</script>

<style scoped>
.hover-zoom {
  transition: transform 0.2s ease-in-out;
}
.hover-zoom:hover {
  transform: translateY(-5px);
}
</style>