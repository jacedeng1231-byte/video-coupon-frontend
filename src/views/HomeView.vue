<template>
  <div class="container mt-4">
    <PageTitle title="會員中心" subtitle="MEMBER CENTER" />

    <!-- Profile Header -->
    <div v-if="user" class="profile-card mt-4">
      <div class="profile-bg"></div>
      <div class="profile-info text-center">
        <div class="avatar-wrapper">
          <img
            v-if="user.pictureUrl"
            :src="user.pictureUrl"
            class="user-avatar-large"
            alt="User Avatar"
          />
          <div v-else class="user-avatar-placeholder"></div>
        </div>
        <h3 class="profile-name">{{ user.displayName }}</h3>
        <p class="profile-status">LINE 認證會員</p>
      </div>
    </div>

    <div v-else class="text-center mt-5 py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-3 text-muted">正在載入會員資料...</p>
    </div>

    <!-- Quick Navigation / Menu -->
    <div class="menu-list mt-4 mb-5">
      <router-link to="/" class="menu-item">
        <div class="menu-item-icon bg-primary-soft">🎬</div>
        <div class="menu-item-text">
          <span class="menu-item-title">看片活動</span>
          <span class="menu-item-desc">觀看精選影片，領取專屬獎勵</span>
        </div>
        <div class="menu-item-arrow">→</div>
      </router-link>

      <router-link to="/coupons" class="menu-item">
        <div class="menu-item-icon bg-success-soft">🎟️</div>
        <div class="menu-item-text">
          <span class="menu-item-title">我的優惠券</span>
          <span class="menu-item-desc">查看並使用您已獲得的折價券</span>
        </div>
        <div class="menu-item-arrow">→</div>
      </router-link>
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
/* Profile Card */
.profile-card {
  background-color: var(--app-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  position: relative;
}

.profile-bg {
  height: 80px;
  background: linear-gradient(135deg, var(--app-primary), #34C759);
  opacity: 0.1;
}

.profile-info {
  padding: 0 24px 24px 24px;
  margin-top: -40px;
}

.avatar-wrapper {
  display: inline-block;
  padding: 4px;
  background-color: var(--app-surface);
  border-radius: 50%;
  margin-bottom: 12px;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--app-border);
}

.user-avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--app-border);
}

.profile-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.profile-status {
  font-size: 0.85rem;
  color: var(--app-text-muted);
  font-weight: 500;
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  background-color: var(--app-surface);
  padding: 16px;
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  box-shadow: var(--shadow-sm);
}

.menu-item:active {
  transform: scale(0.98);
  background-color: #F8F9FA;
  border-color: var(--app-border);
}

.menu-item-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin-right: 16px;
  flex-shrink: 0;
}

.bg-primary-soft { background-color: #E8F2FF; }
.bg-success-soft { background-color: #E8F9EE; }

.menu-item-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-item-title {
  font-weight: 700;
  font-size: 1rem;
  color: var(--app-text-main);
}

.menu-item-desc {
  font-size: 0.75rem;
  color: var(--app-text-muted);
  margin-top: 2px;
}

.menu-item-arrow {
  color: var(--app-border);
  font-weight: 700;
  font-size: 1.1rem;
  margin-left: 8px;
}
</style>
