<template>

<div class="container mt-4">

  <h2 class="text-center mb-4">LINE 活動中心</h2>

  <div class="row g-3">

    <div class="col-6">
      <router-link to="/videos" class="text-decoration-none">
        <div class="card text-center shadow-sm p-3">
          <h4>🎬</h4>
          <p>觀看影片</p>
        </div>
      </router-link>
    </div>

    <div class="col-6">
      <router-link to="/coupons" class="text-decoration-none">
        <div class="card text-center shadow-sm p-3">
          <h4>🎁</h4>
          <p>我的優惠券</p>
        </div>
      </router-link>
    </div>

  </div>

</div>

</template>