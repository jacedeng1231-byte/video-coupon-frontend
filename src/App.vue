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

      // console.log("LINE profile:", profile);
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
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark retro-navbar">
      <div class="container">
        <router-link class="navbar-brand retro-brand" to="/" @click="closeNavbar"> 
          <span class="brand-icon">📺</span> RETRO CENTER 
        </router-link>

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
            <router-link class="nav-link" to="/dashboard" @click="closeNavbar"> 後台 </router-link>
            <router-link class="nav-link" to="/videos" @click="closeNavbar"> 看片領券 </router-link>
            <router-link class="nav-link" to="/coupons" @click="closeNavbar"> 我的優惠券 </router-link>
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

<style scoped>
.retro-navbar {
  background-color: var(--retro-primary);
  border-bottom: 4px solid var(--retro-dark);
  box-shadow: 0 4px 0px var(--retro-dark);
  padding: 10px 0;
  z-index: 1000;
}

.retro-brand {
  font-family: var(--retro-font-display, 'VT323', monospace);
  font-size: 2.2rem;
  color: var(--retro-bg) !important;
  text-shadow: 3px 3px 0px var(--retro-dark);
  letter-spacing: 2px;
  line-height: 1;
}

.brand-icon {
  filter: drop-shadow(2px 2px 0px var(--retro-dark));
}

.nav-link {
  font-family: var(--retro-font-mono, 'Courier New', Courier, monospace);
  font-weight: 900;
  color: var(--retro-bg) !important;
  text-transform: uppercase;
  margin: 0 5px;
  padding: 8px 15px !important;
  border: 2px solid transparent;
  transition: all 0.1s;
}

.nav-link:hover, .nav-link.router-link-active {
  color: var(--retro-dark) !important;
  background-color: var(--retro-accent);
  border: 2px solid var(--retro-dark);
  box-shadow: 4px 4px 0px var(--retro-dark);
  transform: translate(-2px, -2px);
}

/* 漢堡選單按鈕 (Mobile Navbar Toggler) */
.navbar-toggler {
  background-color: var(--retro-accent);
  border: 3px solid var(--retro-dark) !important;
  border-radius: 0;
  padding: 8px 10px;
  box-shadow: 4px 4px 0px var(--retro-dark);
  transition: all 0.1s;
}

.navbar-toggler:active, .navbar-toggler[aria-expanded="true"] {
  background-color: var(--retro-accent);
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--retro-dark);
}

.navbar-toggler:focus {
  outline: none;
  box-shadow: 4px 4px 0px var(--retro-dark);
}
</style>