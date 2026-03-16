<template>
  <div class="container mt-4">
    <PageTitle title="會員中心" subtitle="MEMBER CENTER" />

    <div v-if="user" class="member-card text-center mt-4 p-5 card shadow-sm border-0 rounded-4">
      <img
        v-if="user.pictureUrl"
        :src="user.pictureUrl"
        class="mb-3 user-avatar-large mx-auto"
        alt="User Avatar"
      />
      <h3 class="fw-bold mb-1">歡迎, {{ user.displayName }}!</h3>
      <p class="text-muted mb-0">很高興見到您來到 LINE 活動中心</p>
    </div>

    <div v-else class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-3 text-muted">正在載入會員資料...</p>
    </div>

    <!-- Actions -->
    <div class="row align-items-center justify-content-center g-3 mt-4 mb-5">
      <div class="col-12 col-md-5 text-center">
        <router-link to="/" class="btn btn-primary btn-lg w-100 py-3 text-white fw-bold d-flex align-items-center justify-content-center gap-2 rounded-4 shadow-sm">
          <span class="fs-4">🎬</span> 前往看片活動
        </router-link>
      </div>
      <div class="col-12 col-md-5 text-center">
        <router-link to="/coupons" class="btn btn-outline-secondary btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-4 bg-white shadow-sm">
          <span class="fs-4">🎁</span> 我的專屬優惠券
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "../liff/liffInit";
import PageTitle from "../components/PageTitle.vue";

export default {
  data() {
    return {
      user: null,
    };
  },
  components: { PageTitle },

  async mounted() {
    try {
      const auth = await getAuth();
      
      if (auth && auth.profile) {
        this.user = auth.profile;
      }
    } catch (err) {
      console.error("HomeView error:", err);
    }
  },
};
</script>

<style scoped>
.member-card {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.user-avatar-large {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--app-surface, #fff);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
}
</style>