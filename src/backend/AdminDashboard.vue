<template>
  <div class="container mt-4">
    <h2>後台管理</h2>

    <div class="row mt-4">
      <div class="col-md-4">
        <router-link to="/dashboard/videos" class="text-decoration-none">
          <div class="card text-center p-4 shadow-sm">
            <h4>🎬</h4>

            <p>影片管理</p>
          </div>
        </router-link>
      </div>

      <div class="col-md-4">
        <router-link to="/dashboard/coupons" class="text-decoration-none">
          <div class="card text-center p-4 shadow-sm">
            <h4>🎁</h4>

            <p>優惠券管理</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>

  <router-view />
</template>