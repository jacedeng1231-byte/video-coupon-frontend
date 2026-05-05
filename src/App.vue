<script>
import api from "./api/api";
import { getAuth } from "./liff/liffInit";

export default {
  data() {
    return {
      user: null,
      isAuthReady: false,
    };
  },
  async mounted() {
    try {
      const auth = await getAuth();
      if (auth && auth.profile) {
        this.user = auth.profile;
      }
    } catch (err) {
      console.error("LIFF Login Error:", err);
    } finally {
      this.isAuthReady = true;
    }
  },
  methods: {
    closeNavbar() {
      const navbarCollapse = document.getElementById("navbarNav");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        if (window.bootstrap) {
          const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse) 
            || new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        } else {
          navbarCollapse.classList.remove("show");
        }
      }
    }
  }
};
</script>

<template>
  <!-- Global Loading State -->
  <div v-if="!isAuthReady" class="global-loading">
    <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 3rem;">
      <span class="visually-hidden">載入中...</span>
    </div>
    <p class="mt-3 text-muted fw-bold">連線至 LINE 活動中心...</p>
  </div>

  <div v-else class="app-layout">
    <!-- Top App Bar -->
    <header class="top-bar">
      <div class="container-fluid d-flex justify-content-between align-items-center h-100 px-3">
        <!-- Placeholder for left alignment balance -->
        <div class="top-bar-side"></div>

        <router-link class="brand-title" to="/">
          活動中心
        </router-link>

        <!-- User profile icon or admin link -->
        <div class="top-bar-side d-flex justify-content-end">
          <router-link v-if="user" to="/dashboard" class="user-profile-link" title="前往後台管理">
            <img 
              v-if="user.pictureUrl"
              :src="user.pictureUrl" 
              class="user-avatar-small" 
              alt="User Avatar"
            />
            <div v-else class="user-avatar-placeholder"></div>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Mobile Bottom Navigation (Tab Bar) -->
    <nav class="bottom-tab-bar">
      <div class="container d-flex justify-content-around align-items-center h-100">
        <router-link class="tab-item" to="/" exact-active-class="tab-active">
          <span class="tab-icon">🎬</span>
          <span class="tab-label">看片活動</span>
        </router-link>

        <router-link class="tab-item" to="/member" active-class="tab-active">
          <span class="tab-icon">👤</span>
          <span class="tab-label">會員中心</span>
        </router-link>

        <router-link class="tab-item" to="/coupons" active-class="tab-active">
          <span class="tab-icon">🎟️</span>
          <span class="tab-label">我的優惠券</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* --- Global Loading --- */
.global-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: var(--app-bg);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

/* --- Layout --- */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 54px; /* Native feel header height */
  padding-bottom: 74px; /* Standard tab bar height */
}

/* --- Top Bar --- */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 54px;
  background-color: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
  z-index: 1000;
}

.top-bar-side {
  width: 40px; /* Balance both sides */
}

.brand-title {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--app-text-main);
  text-decoration: none;
  letter-spacing: -0.2px;
}

.user-profile-link {
  display: flex;
  align-items: center;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--app-border);
}

/* --- Main Content --- */
.main-content {
  flex: 1;
}

/* --- Bottom Tab Bar --- */
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 74px;
  background-color: var(--app-surface);
  border-top: 1px solid var(--app-border);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: var(--app-text-muted);
  transition: all 0.2s;
  padding-top: 6px;
}

.tab-icon {
  font-size: 1.4rem;
  margin-bottom: 2px;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.2s;
}

.tab-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.tab-active {
  color: var(--app-primary);
}

.tab-active .tab-icon {
  filter: grayscale(0%);
  opacity: 1;
  transform: translateY(-2px);
}
</style>
