<template>
  <div class="container mt-4">
    <PageTitle title="後台管理" subtitle="ADMIN DASHBOARD" />

    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-4">
        <router-link to="/dashboard/videos" class="text-decoration-none">
          <div class="card text-center p-3 admin-nav-card">
            <div class="d-flex flex-sm-column align-items-center justify-content-center gap-3 gap-sm-2">
              <h3 class="mb-0">🎬</h3>
              <h5 class="mb-0 fw-bold">影片管理</h5>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-12 col-sm-4">
        <router-link to="/dashboard/coupons" class="text-decoration-none">
          <div class="card text-center p-3 admin-nav-card">
            <div class="d-flex flex-sm-column align-items-center justify-content-center gap-3 gap-sm-2">
              <h3 class="mb-0">🎁</h3>
              <h5 class="mb-0 fw-bold">優惠券管理</h5>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-12 col-sm-4">
        <router-link to="/dashboard/users" class="text-decoration-none">
          <div class="card text-center p-3 admin-nav-card">
            <div class="d-flex flex-sm-column align-items-center justify-content-center gap-3 gap-sm-2">
              <h3 class="mb-0">👥</h3>
              <h5 class="mb-0 fw-bold">會員管理</h5>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    
  </div>

  <router-view />
</template>

<script>
import PageTitle from "./../components/PageTitle.vue";

export default {
  components: { PageTitle }
};
</script>

<style scoped>
.admin-nav-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  border-radius: 16px;
}

.admin-nav-card h5 {
  color: var(--app-text-main);
}

.admin-nav-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg) !important;
  border-color: var(--app-primary) !important;
}

.admin-nav-card:hover h5 {
  color: var(--app-primary);
}

.admin-nav-card:active {
  transform: scale(0.98);
}
</style>