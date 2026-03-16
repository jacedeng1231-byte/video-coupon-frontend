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
        // Use Bootstrap's Collapse API to hide it properly
        if (window.bootstrap) {
          const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse) 
            || new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        } else {
          // Fallback if bootstrap JS is not globally available
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
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">載入中...</span>
    </div>
    <p class="mt-3 text-muted fw-bold">連線至 LINE 活動中心...</p>
  </div>

  <div v-else class="app-layout">
    <!-- Top App Bar -->
    <header class="top-bar">
      <div class="container d-flex justify-content-between align-items-center h-100">
        <router-link class="brand-title" to="/">
          LINE 活動中心
        </router-link>

        <!-- 使用者資訊與後台入口 -->
        <router-link v-if="user" to="/dashboard" class="user-profile text-decoration-none" title="前往後台管理">
          <span class="user-name d-none d-sm-inline">{{ user.displayName }}</span>
          <img 
            v-if="user.pictureUrl"
            :src="user.pictureUrl" 
            class="user-avatar" 
            alt="User Avatar"
          />
        </router-link>
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
          <span class="tab-icon">🏠</span>
          <span class="tab-label">首頁</span>
        </router-link>

        <router-link class="tab-item" to="/videos" active-class="tab-active">
          <span class="tab-icon">🎬</span>
          <span class="tab-label">看片</span>
        </router-link>

        <router-link class="tab-item" to="/coupons" active-class="tab-active">
          <span class="tab-icon">🎟️</span>
          <span class="tab-label">優惠券</span>
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
  padding-top: 60px; /* Space for Top Bar */
  padding-bottom: 70px; /* Space for Bottom Tab Bar */
}

/* --- Top Bar --- */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--app-surface);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  z-index: 1000;
}

.brand-title {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--app-text-main);
  text-decoration: none;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--app-text-muted);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--app-border);
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
  height: 70px;
  background-color: var(--app-surface);
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom); /* For iPhone notch handling */
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
  transition: color 0.2s;
}

.tab-icon {
  font-size: 1.5rem;
  margin-bottom: 2px;
  filter: grayscale(100%) opacity(0.6);
  transition: all 0.2s;
}

.tab-label {
  font-size: 0.75rem;
  font-weight: 600;
}

.tab-active {
  color: var(--app-primary);
}

.tab-active .tab-icon {
  filter: grayscale(0%) opacity(1);
  transform: translateY(-2px);
}
</style>